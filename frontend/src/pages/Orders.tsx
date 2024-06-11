import { ReactElement, useEffect, useState } from 'react'
import TableHOC from '../components/admin/TableHOC';
import {Column} from 'react-table';
import { Link } from 'react-router-dom';
import { CustomError, UserReducerIntialState } from '../types/types';
import toast from 'react-hot-toast';
import { useMyOrderQuery } from '../redux/api/orderApi';
import { useSelector } from 'react-redux';
import { Skeleton } from '../components/Loading';

type DataType={
  _id:String
  amount:number
  quantity:number
  discount:number
  status:ReactElement
  action:ReactElement

}

const column:Column<DataType>[]=[
  {
    Header:"ID",
    accessor:"_id"
  },
  {
    Header:"Amount",
    accessor:'amount'
  },
  {
    Header:"Quantity",
    accessor:'quantity'
  },
  {
    Header:"Discount",
    accessor:'discount'
  },
  {
    Header:"Action",
    accessor:'action'
  },
  {
    Header:"Status",
    accessor:'status'
  },
]
const Orders = () => {
  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const {data,isLoading,isError,error}=useMyOrderQuery(user?._id!)
  if(isError){
    const err=error as CustomError;
    toast.error(err.data.message)
    }

  const [rows,setRows]=useState<DataType[]>([])

  useEffect(()=>{
    if(data){
      setRows(data.order.map((i)=>({
        _id:i._id,
        amount:i.total,
        quantity:i.orderItems.length,
        discount:i.discount,
        status: <span className={i.status==="processing"?"red":i.status==="shipped"?"purple":"green"}>{i.status}</span>,
        action: <Link to={`/order/${i._id}`}>View</Link>
      })))
    }
  },[data])
  const Table=TableHOC<DataType>(column,rows,'dashboard-product-box','Orders',
  rows.length>6
  )();
  return (
    <div className='container'>
      <h1>My Orders</h1>
      {isLoading?<Skeleton/>:Table}
    </div>
  )
}

export default Orders
