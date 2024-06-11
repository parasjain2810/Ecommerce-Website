import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { useSelector } from "react-redux";
import { CustomError, UserReducerIntialState } from "../../types/types";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../types/apiTypes";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Customers = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const {data,isError,error}=useAllUsersQuery(user?._id!)
  const [deleteUser]=useDeleteUserMutation();

  if(isError){
    const err=error as CustomError;
    toast.error(err.data.message)
    }

    useEffect(()=>{
      if(data){
        setRows(data.users.map((i)=>({
          avatar:<img
          style={{
            borderRadius: "50%",
          }}
          src={i.photo}
          alt="Shoes"
        />,
        name:i.name, 
        email:i.email, 
        gender:i.gender, 
        role:i.role, 
        action:<button onClick={async()=>{
          try {
            const res=await deleteUser({
             customer_id:i._id,
             userid:user?._id!
            })
   
            if("data" in res){
             toast.success(res.data.message)
            }
            else{
             const error=res.error as FetchBaseQueryError
             const message=(error.data as MessageResponse).message
             toast.error(message)
            }
         } catch (error) {
           toast.error("User Doesn't Delete")
         }
        }}>
        <FaTrash />
      </button>
        })))
      }
    },[data])
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
    </div>
  );
};

 export default Customers;


