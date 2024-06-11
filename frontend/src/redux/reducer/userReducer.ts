import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {  User, UserReducerIntialState } from "../../types/types";
const initialState:UserReducerIntialState={
    user:null,
    loading:true
}

// const productInitialState:ProductReducerIntialState={
//   product:null,
//   loading:true,
// }


export const userReducer=createSlice({
    name:"userReducer",
    initialState,
    reducers:{
     userExist:(state,action:PayloadAction<User>)=>{
       state.loading=false;
       state.user=action.payload
     },
     userNotExist:(state)=>{
       state.loading=false;
       state.user=null;
     }
    },
})

// export const productReducer=createSlice({
//   name:"productReducer",
//   initialState:productInitialState,
//   reducers:{
//     productItems:(state,action:PayloadAction<Product>)=>{
//         state.loading=true,
//         state.product=action.payload
//     }
//   }
// })


export const {userExist,userNotExist}=userReducer.actions
// export const {productItems}=productReducer.actions