import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productApi";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";
import { dashboardApi } from "./api/dashboardApi";
import { couponApi } from "./api/couponApi";

export const store=configureStore({
    reducer:{
        [userAPI.reducerPath]:userAPI.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [userReducer.name]:userReducer.reducer,
        [cartReducer.name]:cartReducer.reducer,
        [orderApi.reducerPath]:orderApi.reducer,
        [dashboardApi.reducerPath]:dashboardApi.reducer,
        [couponApi.reducerPath]:couponApi.reducer,
    },
    middleware:(mid)=>mid().concat(userAPI.middleware,productApi.middleware,orderApi.middleware,dashboardApi.middleware,couponApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;