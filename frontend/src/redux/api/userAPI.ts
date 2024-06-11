import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../../types/apiTypes";
import { AllUserResponse, DeleteUser, NewProductResponse, User, UserResponse } from "../../types/types";
import axios from "axios";


export const userAPI=createApi({reducerPath:"userApi",
    baseQuery:fetchBaseQuery({baseUrl:`http://localhost:5000/api/v1/user/`
}),
tagTypes:['user'],
    endpoints:(builder)=>({
        login:builder.mutation<MessageResponse,User>({
            query:(user)=>({
                url:"new",
                method:"POST",
                body:user
            }),invalidatesTags:['user']
        }),
        allUsers:builder.query<AllUserResponse,string>({query:(id)=>`all?id=${id}`,providesTags:['user']}),
        deleteUser:builder.mutation<NewProductResponse,DeleteUser>({query:({customer_id,userid})=>({
            url:`${customer_id}?id=${userid}`,
            method:'DELETE'
        }),invalidatesTags:['user']}),
        singleUser:builder.query<User,string>({query:(id)=>`${id}`,providesTags:['user']})
    }),
})


export const getUser=async(id:string)=>{
    try {
        const {data}:{data:UserResponse}=await axios.get(`http://localhost:5000/api/v1/user/${id}`)
        return data;
    } catch (error) {
        throw error;
    }
}

export const {useLoginMutation,useAllUsersQuery,useDeleteUserMutation,useSingleUserQuery}=userAPI