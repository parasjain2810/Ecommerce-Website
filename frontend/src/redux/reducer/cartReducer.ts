import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartItem, CartReducerIntialState, ShippingInfo } from "../../types/types";

const initialState:CartReducerIntialState={
    cartItems:[],
    subTotal:0,
    total:0,
    discount:0,
    Shipping:0,
    tax:0,
    loading:false,
    shippingInfo:{
        address:"",
        city:"",
        state:"", 
        country:"",
        pincode:0
    }
}

export const cartReducer=createSlice({
    name:"cartReducer",
    initialState,
    reducers:{
       addtoCart:(state,action:PayloadAction<CartItem>)=>{
           state.loading=true;
           const item=action.payload
           const itemExist=state.cartItems.find((i)=>i.productId==item.productId)
              
             if(item.productId!==itemExist?.productId){
                state.cartItems.push(item);
             }
           state.loading=false
       },
       decrementQunatity:(state,action)=>{
            state.loading=true
            const id =action.payload;
            state.cartItems.forEach((i)=>{
                if(id==i.productId){
                    if(i.quantity>1){
                        i.quantity-=1
                    }
                }
            }) 
            state.loading=false
       },
       incrementQuantity:(state,action)=>{
            state.loading=true
            const id =action.payload;
            state.cartItems.forEach((i)=>{
                if(id==i.productId){
                        i.quantity+=1
                }
            }) 
            state.loading=false
       },
       deleteProduct:(state,action)=>{
          state.loading=true
          const id  =action.payload
          state.cartItems=state.cartItems.filter((i)=>i.productId!==id)
          state.loading=false
        },
        calculate:(state)=>{
          let subTotal=0;
          for(let i=0; i<state.cartItems.length; i++){
            const item=state.cartItems[i]
            subTotal += item.price*item.quantity
          }
          state.subTotal=subTotal
          state.tax=Math.round(state.subTotal*0.18)
          state.Shipping=state.subTotal>1000?0:200
          state.total=state.subTotal+state.tax+state.Shipping-state.discount
        },
        discountApplier:(state,action)=>{
           state.discount=action.payload
        },
        saveShippingInfo:(state,action:PayloadAction<ShippingInfo>)=>{
             state. shippingInfo=action.payload
        },
        resetCart:()=>{initialState}
    }
})

export const {deleteProduct,addtoCart,decrementQunatity,incrementQuantity,calculate,discountApplier,resetCart,saveShippingInfo}=cartReducer.actions