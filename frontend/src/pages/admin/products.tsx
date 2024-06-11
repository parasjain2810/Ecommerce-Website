import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductQuery } from "../../redux/api/productApi";
import { Skeleton } from "../../components/Loading";
import toast from "react-hot-toast";
import { CustomError, UserReducerIntialState } from "../../types/types";
import { useSelector } from "react-redux";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Products = () => {

  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)

  const {data,isError,isLoading,error}=useAllProductQuery(`${user?._id}`);
 
  if(isError){
    toast.error((error as CustomError).data.message)
  }

  const [rows, setRows] = useState<DataType[]>([]);


 useEffect(()=>{
  if(data)
    setRows(data.products.map((i)=>({
      photo:<img src={`http://localhost:5000/${i.photo}`} alt={`${i.name}`}/>,
      name:i.name,
      price:i.price,
      stock:i.stock,
      action:<Link to={`/admin/product/${i._id}`}>Manage</Link>
    })))
 },[data])
    
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    isLoading?<Skeleton/>:<div className="admin-container">
          <AdminSidebar />
           <main>{Table}</main>
            <Link to="/admin/product/new" className="create-product-btn">
             <FaPlus />
            </Link>
  </div>

  // <div className="admin-container">
  //         <AdminSidebar />
  //          <main>{Table}</main>
  //           <Link to="/admin/product/new" className="create-product-btn">
  //            <FaPlus />
  //           </Link>
  // </div>
  );
};

export default Products;
