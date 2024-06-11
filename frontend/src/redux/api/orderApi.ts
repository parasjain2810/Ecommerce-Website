import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrderResponse, MessageResponse, SingleOrderResponse } from "../../types/apiTypes";
import { DeleteOrder, NewOrderRequest, UpdateOrderRequest } from "../../types/types";

export const orderApi=createApi({reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({baseUrl:`http://localhost:5000/api/v1/order/`}),
    tagTypes:['order'],
    endpoints:(builder)=>({
        newOrder:builder.mutation<MessageResponse,NewOrderRequest>({query:(order)=>({
            url:'new',
            method:"POST",
            body:order
        }),invalidatesTags:['order']}),
        myOrder:builder.query<AllOrderResponse,string>({query:(id)=>`my-order?id=${id}`,providesTags:['order']}),
        allOrder:builder.query<AllOrderResponse,string>({query:(id)=>`admin-order?id=${id}`,providesTags:['order']}),
        singleOrder:builder.query<SingleOrderResponse,string>({query:(orderId)=>`${orderId}`,providesTags:['order']}),
        updateOrder:builder.mutation<MessageResponse,UpdateOrderRequest>({query:({userId,orderId})=>({
            url:`${orderId}?id=${userId}`,
            method:"PUT",
        }),invalidatesTags:['order']}),
        deleteOrder:builder.mutation<MessageResponse,DeleteOrder>({query:({userid,orderId})=>({
            url:`${orderId}?id=${userid}`,
            method:"DELETE",
        }),invalidatesTags:['order']}),
        
    })
}
)

export const {useNewOrderMutation,useAllOrderQuery,useDeleteOrderMutation,useMyOrderQuery,useUpdateOrderMutation,useSingleOrderQuery}=orderApi