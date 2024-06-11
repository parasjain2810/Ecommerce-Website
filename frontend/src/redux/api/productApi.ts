import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryResponse, DeleteProduct, NewProduct, NewProductResponse, Product, ProductResponse, SearchProduct, SearchQueryProduct, SingleProductResponse, UpdateProduct } from "../../types/types";



export const productApi=createApi({reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`http://localhost:5000/api/v1/product/`
}),
tagTypes:["product"],
    endpoints:(builder)=>({
        latestProduct:builder.query<ProductResponse,string>({query:()=>'latest',providesTags:['product']}),
        allProduct:builder.query<ProductResponse,string>({query:(id)=>`admin-product?id=${id}`,providesTags:['product']}),
        searchProduct:builder.query<SearchProduct,SearchQueryProduct>({query:({category,page,price,sort,search})=>{
            let base=`all?search=${search}&page=${page}`

            if(price) base+=`&price=${price}`
            if(sort)  base+=`&sort=${sort}`
            if(category)  base+=`&category=${category}`

            return base
        },providesTags:['product']}),
        allCategory:builder.query<CategoryResponse,string>({query:()=>`categories`,providesTags:['product']}),
        newProduct:builder.mutation<NewProductResponse,NewProduct>({query:({formData,id})=>({
           url:`new?id=${id}`,
           method:"POST",
           body:formData
        }),invalidatesTags:['product']}),
        singleProduct:builder.query<SingleProductResponse,string>({query:(id)=>id,providesTags:['product']}),
        updateProduct:builder.mutation<NewProductResponse,UpdateProduct>({query:({formData,id,userid})=>({
            url:`${id}?id=${userid}`,
            method:"PUT",
            body:formData
        }),invalidatesTags:['product']}),
        deleteProduct:builder.mutation<NewProductResponse,DeleteProduct>({query:({id,userid})=>({
            url:`${id}?id=${userid}`,
            method:'DELETE'
        }),invalidatesTags:['product']})

    }),
})


export const {useLatestProductQuery,useAllProductQuery,useAllCategoryQuery,useSearchProductQuery,useNewProductMutation,useSingleProductQuery,useUpdateProductMutation,useDeleteProductMutation}=productApi