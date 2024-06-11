import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/Error.js";
import { Order } from "../model/order.js";
import { Product } from "../model/products.js";
import { User } from "../model/user.js";
import { calculatePercentage } from "../utils/calculatePercentage.js";
import { getChartData } from "../utils/getChartData.js";

export const getDashBoardStats=TryCatch(async(req,res,next)=>{
    let stats;
    if(myCache.has('admin-stats'))
        stats=JSON.parse(myCache.get('admin-stats') as string)
    else{
        const today = new Date();
        const sixMonthAgo=new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth()-6); 


        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
          };
      
          const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
          };
      
          const thisMonthProductsPromise = Product.find({
            createdAt: {
              $gte: thisMonth.start,
              $lte: thisMonth.end,
            },
          });
      
          const lastMonthProductsPromise = Product.find({
            createdAt: {
              $gte: lastMonth.start,
              $lte: lastMonth.end,
            },
          });
      
          const thisMonthUsersPromise = User.find({
            createdAt: {
              $gte: thisMonth.start,
              $lte: thisMonth.end,
            },
          });
      
          const lastMonthUsersPromise = User.find({
            createdAt: {
              $gte: lastMonth.start,
              $lte: lastMonth.end,
            },
          });
      
          const thisMonthOrdersPromise = Order.find({
            createdAt: {
              $gte: thisMonth.start,
              $lte: thisMonth.end,
            },
          });
      
          const lastMonthOrdersPromise = Order.find({
            createdAt: {
              $gte: lastMonth.start,
              $lte: lastMonth.end,
            },
          });

          const lastSixMonthOrdersPromise=Order.find({
            createdAt:{
              $gte:sixMonthAgo,
              $lte:today
            }
          })

          const latestTransactionsPromise=Order.find({}).select(["orderItems","discount","total","status","quantity"]).limit(4);

          const [ thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
            productCount,
            userCount,
            orderRevenue,
            lastSixMonthOrders,
            categories,
            femaleCount,
            latestTransactions]=await Promise.all([
                thisMonthProductsPromise,
                thisMonthUsersPromise,
                thisMonthOrdersPromise,
                lastMonthProductsPromise,
                lastMonthUsersPromise,
                lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select('total'),
                lastSixMonthOrdersPromise,
                Product.distinct('category'),
                User.countDocuments({
                  gender:'female'
                }),
                latestTransactionsPromise
        ])

        const thisMonthRevenue=thisMonthOrders.reduce((total,order)=> total + (order.total||0),0)
        const lastMonthRevenue=lastMonthOrders.reduce((total,order)=> total + (order.total||0),0)


        
        const changePercentage={
          revenue:calculatePercentage(thisMonthRevenue,lastMonthRevenue),
          user:calculatePercentage(thisMonthUsers.length,lastMonthUsers.length),
          product:calculatePercentage(thisMonthProducts.length,lastMonthProducts.length),
          order:calculatePercentage(thisMonthOrders.length,lastMonthOrders.length)
        }
        
        const revenue=orderRevenue.reduce((total,order)=>
         total+(order.total||0),0 
        )

        const counts={
          user:userCount,
          product:productCount,
          orderRevenue:revenue,
          orderCount:orderRevenue.length
        }

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthyRevenue = new Array(6).fill(0);
        
        lastSixMonthOrders.forEach((order)=>{
          const createDate=order.createdAt;
          const monthDiff=(today.getMonth()-createDate.getMonth()+12)%12;

          if(monthDiff<6){
            orderMonthCounts[5-monthDiff]+=1;
            orderMonthyRevenue[5-monthDiff]+=order.total;
          }
        })

        const categoryCountPromise= categories.map((category)=>(
          Product.countDocuments({category})
        ))

        const categoryCount=await Promise.all(categoryCountPromise);

        const categoriesCount:Record<string,number>[]=[];

        categories.forEach((category,i)=>{
          categoriesCount.push({
            [category]:Math.round((categoryCount[i]/productCount)*100)
          })
        })

        const ratio={
          men:userCount-femaleCount,
          female:femaleCount
        }

        const modifiedTrasaction=latestTransactions.map((i)=>(
          {
            _id:i._id,
            discount:i.discount,
            total:i.total,
            orderItems:i.orderItems.length,
            status:i.status
          }
        ))  

        stats={
          changePercentage,
          counts,
          chart:{
            orderMonthCounts,
            orderMonthyRevenue
          },
          categoriesCount,
          ratio,
          modifiedTrasaction
        }

        myCache.set("admin-stats",JSON.stringify(stats))
    }
    return res.status(201).json({
        success:true,
        stats
    })
})


export const getDashBoardPie=TryCatch(async(req,res,next)=>{
   let charts

   if(myCache.has('admin-pie-charts')){
    charts=JSON.parse(myCache.get('admin-pie-charts') as string)
   }
   else{
    
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      outOfStock,
      inStock,
      users,
      adminCount,
      allOrders
    ]=await Promise.all([
      Order.countDocuments({status:'processing'}),
      Order.countDocuments({status:'shipped'}),
      Order.countDocuments({status:'delivered'}),
      Product.distinct('category'),
      Product.countDocuments({
        stock:0
      }),
      Product.countDocuments({stock:{$gt:0}}),
      User.find({}).select('dob'),
      User.countDocuments({
        role:'admin'
      }),
      Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"])
    ])
    
    const orderFullFillment={
      Processing:processingOrder,
      Shipped:shippedOrder,
      Delivered:deliveredOrder
    }

    const categoriesCountPromise= categories.map(category=>(
     Product.countDocuments({category})
    ))

    const categoriesCount=await Promise.all(categoriesCountPromise);

    const productCategory:Record<string,number>[]=[]
    
    categories.forEach((category,i)=>{
      productCategory.push({
        [category]:Math.round(categoriesCount[i])
      })
    })

    const stockAvailability={
      outOfStock:outOfStock,
      inStock:inStock
    }

    const calculate_age=(dob:any)=>{
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms); 
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
   let older=0
   let teenager=0
   let adult=0
   let age
   
    users.map((i)=>{
      age=calculate_age(i.dob)
      // console.log(age);
      if(age>=40) older++
      if(age<20) teenager++
      if(age<40&&age>=20) adult++
    })
  
    const UserAge={
      older:older,
      teenager:teenager,
      adult:adult
    }

    // const UserAge={
    //   teen:users.filter((i)=>i.age<20).length,
    //   adult:users.filter((i)=>i.age>40&&i.age>=20).length,
    //   older:users.filter((i)=>i.age>40).length
    // }

    const isAdmin={
      admin:adminCount,
      customers:users.length-adminCount
    }

    const grossIncome=allOrders.reduce((prev,order)=>prev+(order.total||0),0);
    const discount=allOrders.reduce((prev,order)=>prev+(order.discount||0),0);
    const productionCost=allOrders.reduce((prev,order)=>prev+(order.shippingCharges||0),0);
    const burnt=allOrders.reduce((prev,order)=>prev+(order.tax||0),0)
    const marketingCost=Math.round(grossIncome*(30/100))
    const netMargin=grossIncome-discount-productionCost-burnt-marketingCost;
    const revenueDistribution={
      netMargin:netMargin,
      discount:discount,
      productionCost:productionCost,
      burnt:burnt,
      marketingCost:marketingCost,
    }


     charts={
      orderFullFillment,
      productCategory,
      stockAvailability,
      // user_age,
      UserAge,
      isAdmin,
      revenueDistribution
     }
    
    myCache.set("admin-pie-charts",JSON.stringify(charts))
   }

   return res.status(201).json({
    success:true,
    charts
})
})


export const getDashBoardBar=TryCatch(async(req,res,next)=>{
  let charts;
  const key = "admin-bar-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
})


export const getDashBoardLine=TryCatch(async(req,res,next)=>{
  let lines;
  const key = "admin-line-charts";

  if (myCache.has(key)) lines = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select(["createdAt","discount","total"]);

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });
    const discountsCounts = getChartData({ length: 12, today, docArr: orders ,property:"discount"});
    const revenueCounts = getChartData({ length: 12, today, docArr: orders ,property:"total"});

    lines = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
      discount: discountsCounts,
      revenue:revenueCounts
    };

    myCache.set(key, JSON.stringify(lines));
  }

  return res.status(200).json({
    success: true,
    lines,
  });
})
