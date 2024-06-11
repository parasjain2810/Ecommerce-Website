import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { CustomError, UserReducerIntialState } from "../../types/types";
import { useSelector } from "react-redux";
import { useAllOrderQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loading";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}



const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const [rows, setRows] = useState<DataType[]>([]);
  const {data,isLoading,isError,error}=useAllOrderQuery(user?._id!)

  if(isError){
    const err=error as CustomError;
    toast.error(err.data.message)
    }

  
  useEffect(()=>{
    if(data){
      setRows(data.order.map((i)=>({
         user:i.user.name,
         discount:i.discount,
         amount:i.total, 
         quantity:i.orderItems.length,
         status:<span className={i.status==="delivered"
         ?"purple"
         :i.status==="shipped"
         ? "green"
         : "red"}>{i.status}</span>,
         action:<Link to={`/admin/transaction/${i._id}`}>Manage</Link>

      })))
    }
  },[data])
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<Skeleton/>:Table}</main>
    </div>
  );
};

export default Transaction;
