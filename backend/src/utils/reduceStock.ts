import { Product } from "../model/products.js";
import { OrderItemType } from "../types/types.js";

export const reduceStock=async (orderItems:OrderItemType[]) =>{
  for(let i=0; i<orderItems.length; i++){
    const order=orderItems[i];
    const product=await Product.findById(order.productId);
    if(!product) throw new Error("Product not Found");
    product.stock-=order.quantity;
    await product.save();
  }

}