import { myCache } from "../app.js";
import { Order } from "../model/order.js";
import { Product } from "../model/products.js";
import { User } from "../model/user.js";
import { InvalidateCacheProps } from "../types/types.js";

export const revalidateCache=async({ product,
    order,
    admin,
    userId,
    orderId,
    productId,}:InvalidateCacheProps)=>{
        
                  if(product){
                    const productkeys:string[]=["latest-product","categories","all-products"];
                    if(typeof productId==='string'){
                      productkeys.push(`product-${productId}`)
                    }if(typeof productId==='object'){
                      productId.forEach(i=>{productkeys.push(`product-${i}`)})
                    }

                     myCache.del(productkeys);
                  }

                  if(order){
                    const orderkeys:string[]=["getOrder",`single-order${orderId}`,`myorder-${userId}`];
                    const orders=await Order.find({}).select('_id');
                    orders.forEach(i=>{
                      orderkeys.push(`single-order${i._id}`)
                    })

                    myCache.del(orderkeys);
                  }

                  
    }