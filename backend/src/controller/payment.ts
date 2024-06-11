import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/Error.js";
import { Coupon } from "../model/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const createPayment=TryCatch(async(req,res,next)=>{

    const {amount}=req.body;

    if(!amount){
        return next(new ErrorHandler('Enter the Amount',501));
    }

    const paymentIntent=await stripe.paymentIntents.create({
        amount:Number(amount)*100,
        currency:'inr',
    })

    return res.status(207).json({
        success:true,
        message:"Payment Successfully",
        clientSecret:paymentIntent.client_secret
    })
})

export const newCoupon=TryCatch(async(req,res,next)=>{

    const { coupon, amount } = req.body;

    if (!coupon || !amount)
      return next(new ErrorHandler("Please enter both coupon and amount", 400));
  
    await Coupon.create({ code: coupon, amount:amount });
    
    return res.status(201).json({
      success: true,
      message: `Coupon ${coupon} Created Successfully`,
    });
})

export const applyDiscount=TryCatch(async(req,res,next)=>{
    const {coupon}=req.query;

    const discount=await Coupon.findOne({code:String(coupon)});
    if(!discount) return next(new ErrorHandler("NO coupon found",300))

        return res.status(200).json({
            success:true,
            message:`Discount of ${discount.amount} successfull`,
            Discount:discount.amount
        })

})

export const allCoupons=TryCatch(async(req,res,next)=>{
    const AllCoupons=await Coupon.find({});

    if(!AllCoupons) return next(new ErrorHandler("No Coupons are found",701));

    return res.status(201).json({
        success:true,
        AllCoupons
    })
})


export const DeleteCoupon=TryCatch(async(req,res,next)=>{
    const {id}=req.params;

    const coupon=await Coupon.findById(id);

    if(!coupon) return next(new ErrorHandler("No Coupon is found",701));

    await coupon.deleteOne();

    return res.status(201).json({
        success:true,
        message:"Coupon deleted Successfully"
    })
})