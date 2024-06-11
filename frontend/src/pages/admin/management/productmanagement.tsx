import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { UserReducerIntialState } from "../../../types/types";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDeleteProductMutation, useSingleProductQuery, useUpdateProductMutation } from "../../../redux/api/productApi";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../../types/apiTypes";
import { Skeleton } from "../../../components/Loading";

const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const Productmanagement = () => {

  const navigate=useNavigate();

  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)

  const params=useParams();
  const {data,isLoading,isError, error}=useSingleProductQuery(params.id!)
  


  // const [product,setProduct]=useState({
  //   _id:"",
  //   price:0,
  //   stock:0,
  //   name:"",
  //   category:"",
  //   photo:""
  // })
  const {name,stock,price,category,photo,_id}=data?.product||{
    _id:"",
    price:0,
    stock:0,
    name:"",
    category:"",
    photo:""
  }



  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();
  
  const [updateProduct]=useUpdateProductMutation();
  const [deleteProduct]=useDeleteProductMutation();
  


  useEffect(()=>{
    if(data){
      setPriceUpdate(price)
      setStockUpdate(stock)
      setNameUpdate(name)
      setCategoryUpdate(category)
      setPhotoUpdate(photo)
    } 
    
    },[data])
    if(isError){
      return <Navigate to={"/404"}/>
    }


  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async(e: FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try {
      const formData=new FormData();
      formData.set("name",nameUpdate)
      formData.set("price",priceUpdate.toString())
      if(stockUpdate!==undefined)
        formData.set("stock",stockUpdate.toString())
      formData.set("photo",photoFile!)
      formData.set("category",categoryUpdate)
  
      const res=await updateProduct({
        id:_id,
        formData:formData,
        userid:user?._id!
      })

      if("data"in res){
        toast.success(res.data.message)
        navigate(`/admin/product/${_id}`)
      }else{
        const error=res.error as FetchBaseQueryError
        const message=(error.data as MessageResponse).message
        toast.error(message)
      }
    } catch (error) {
      toast.error("Product Updation Failed")
    }
   
  };

  const deleteHandler=async()=>{
     try {
      const confirmation=confirm("Do You Want To Delete Product");
      if(confirmation){
        const res=await deleteProduct({
          id:_id,
          userid:user?._id!
        })
  
        if("data" in res){
          toast.success(res.data.message)
          navigate(`/admin/product`)
        }else{
          const error=res.error as FetchBaseQueryError
          const message=(error.data as MessageResponse).message
          toast.error(message)
        }
      }
     } catch (error) {
      toast.error("Product Deletion Failed")
     }
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
       {isLoading?<Skeleton/>:
       <main className="product-management">
        <section>
          <strong>ID - {_id}</strong>
          <img src={`http://localhost:5000/${photo}`} alt={`${name}`} />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => {
                  if(Number(e.target.value)>=1){
                    setPriceUpdate(Number(e.target.value))
                  }
                }}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) =>{
                  if(Number(e.target.value)>=0){
                    setStockUpdate(Number(e.target.value))
                  }
                }}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button type="submit">Update</button>
          </form>
        </article>
      </main>}
    </div>
  );
};

export default Productmanagement;
