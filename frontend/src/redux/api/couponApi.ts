import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCoupons, CouponCreate, DeleteCoupon, MessageResponse } from "../../types/apiTypes";

export const couponApi=createApi({reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:5000/api/v1/payment/"}),
    tagTypes:["coupon"],
    endpoints:(builder)=>({
         newCoupon:builder.mutation<MessageResponse,CouponCreate>({query:({coupon,id})=>({
            url:`coupon/new?id=${id}`,
            method:"POST",
            body:coupon
         }),invalidatesTags:["coupon"]}),
         allCoupons:builder.query<AllCoupons,string>({query:(id)=>`coupons?id=${id}`,providesTags:['coupon']}),
         applyCoupon:builder.query<MessageResponse,string>({query:(coupon)=>`discount?coupon=${coupon}`,providesTags:['coupon']}),
         deleteCoupon:builder.mutation<MessageResponse,DeleteCoupon>({query:({userId,couponId})=>({
            url:`${couponId}?id=${userId}`,
            method:"DELETE",
        }),invalidatesTags:['coupon']})
    })
})

export const {useNewCouponMutation,useAllCouponsQuery,useDeleteCouponMutation,useApplyCouponQuery}=couponApi;