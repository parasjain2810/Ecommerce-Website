import { FaTrash } from "react-icons/fa";
import { Link, Navigate,  useNavigate,  useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import {  Order, OrderItems, UserReducerIntialState} from "../../../types/types";
import { useDeleteOrderMutation, useSingleOrderQuery, useUpdateOrderMutation } from "../../../redux/api/orderApi";
import { Skeleton } from "../../../components/Loading";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../../types/apiTypes";

const defaultData:Order={
  shippingInfo:{
    address:"",
    city:"",
    country:"",
    state:"",
    pincode:0,
  },
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems:[],
   user:{
    name:"",
    _id:""
   },
   _id:""

}
const TransactionManagement = () => {
   
  const params=useParams();
  const {id}=params
  const {data,isError,isLoading}=useSingleOrderQuery(id!)
  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const navigate=useNavigate()


 
  const { subtotal, shippingCharges,tax,discount,total,status,shippingInfo,user:{name},_id,orderItems}=data?.order||defaultData
 
  const [updateOrder]=useUpdateOrderMutation()
  const [deleteOrder]=useDeleteOrderMutation()

  const updateHandler = async() => {  
     const res=await updateOrder({
      userId:user?._id!,
      orderId:data?.order._id!
     })
     if("data" in res){
      toast.success(res.data.message)
      navigate("/admin/transaction")
     }else{
      const error=res.error as FetchBaseQueryError
      const message=(error.data as MessageResponse).message
      toast.error(message)
    }
  }
  const deleteHandler=async()=>{
    const confirmation=confirm("Do You Want To delete the Order")
    if(confirmation){
      const res=await deleteOrder({
        userid:user?._id!,
        orderId:data?.order._id!
      })
      if("data" in res){
        toast.success(res.data.message)
        navigate("/admin/transaction")
      }else{
        const error=res.error as FetchBaseQueryError
        const message=(error.data as MessageResponse).message
        toast.error(message)
      }
    }
   
  }
  
  if(isError){
    return <Navigate to={"/404"}/>
  }
 

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton/>:
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`http://localhost:5000/${i.photo}`}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} ${shippingInfo.pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "delivered"
                  ? "purple"
                  : status === "shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>}
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItems) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
