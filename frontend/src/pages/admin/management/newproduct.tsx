import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productApi";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../../types/apiTypes";
import { useSelector } from "react-redux";
import { UserReducerIntialState } from "../../../types/types";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();
  const navigate=useNavigate();

  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const [newProduct]=useNewProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };
  const newProductHandler=async(e:FormEvent<HTMLFormElement>)=>{

    e.preventDefault();

    if(!name||!price||stock<0||!photo||category) return; 
    try {
      const formData=new FormData();
      formData.set("name",name)
      formData.set("price",price.toString())
      formData.set("stock",stock.toString())
      formData.set("photo",photo!)
      formData.set("category",category)

      const res=await newProduct({
       id:user?._id!,
       formData:formData
      })

      if("data"in res){
        toast.success(res.data.message)
        navigate('/admin/product')
      }else{
        const error=res.error as FetchBaseQueryError
        const message=(error.data as MessageResponse).message
        toast.error(message)
      }
    } catch (error) {
      toast.error("Product Creation Failed")
    }
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={newProductHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
