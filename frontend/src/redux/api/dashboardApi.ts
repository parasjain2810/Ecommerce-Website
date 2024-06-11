import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StaticalResponse} from "../../types/apiTypes";

export const dashboardApi=createApi({reducerPath:"dashboardApi",
    baseQuery:fetchBaseQuery({baseUrl:`http://localhost:5000/api/v1/dashboard/`}),
    endpoints:(builder)=>({
        staticalInfo:builder.query<StaticalResponse,string>({query:(id)=>`stats?id=${id}`,keepUnusedDataFor:0}),
        barInfo:builder.query<BarResponse,string>({query:(id)=>`bar?id=${id}`,keepUnusedDataFor:0}),
        pieInfo:builder.query<PieResponse,string>({query:(id)=>`pie?id=${id}`,keepUnusedDataFor:0}),
        lineInfo:builder.query<LineResponse,string>({query:(id)=>`line?id=${id}`,keepUnusedDataFor:0}),
    })
}
)

export const {useStaticalInfoQuery,useBarInfoQuery,usePieInfoQuery,useLineInfoQuery}=dashboardApi