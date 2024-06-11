import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom"

interface Props{
    children?:ReactElement,
    isAuthenticate:boolean,
    adminOnly?:boolean,
    isAdmin?:boolean ,
    redirect:string

}
export const ProtectedRoute=({isAuthenticate,children,adminOnly,isAdmin,redirect='/'}:Props)=>{

     if(!isAuthenticate){
        return <Navigate to={redirect}/>
     }

     if(adminOnly&&!isAdmin){
        return <Navigate to={redirect}/>
     }
       
     return children?children:<Outlet/>
}