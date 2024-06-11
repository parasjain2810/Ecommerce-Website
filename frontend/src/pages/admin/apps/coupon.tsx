import { FormEvent, ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAllCouponsQuery, useDeleteCouponMutation, useNewCouponMutation } from "../../../redux/api/couponApi";
import { CustomError, UserReducerIntialState } from "../../../types/types";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../../types/apiTypes";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../../../components/admin/TableHOC";
import { FaTrash } from "react-icons/fa";
import { Skeleton } from "../../../components/Loading";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";
interface DataType {
  
  Coupon: string;
  Amount: number;
  action: ReactElement;
}
const columns: Column<DataType>[] = [
  {
    Header: "Coupon",
    accessor: "Coupon",
  },
  {
    Header: "Amount",
    accessor: "Amount",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Coupon = () => {


  const {user}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)
  const [rows, setRows] = useState<DataType[]>([]);
  const {data,isError,isLoading,error}=useAllCouponsQuery(user?._id!)
  const [deleteCoupon]=useDeleteCouponMutation();
  if(isError){
    const err=error as CustomError;
    toast.error(err.data.message)
    }
  const [newCoupon]=useNewCouponMutation();
  const navigate=useNavigate();
  const [size, setSize] = useState<number>(8);
  const [amount, setAmount] = useState<number>();
  const [prefix, setPrefix] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>("");

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    let ok:boolean
    ok=confirm("Do you want To create Coupon")
    if(ok){
     const res=await newCoupon({coupon:{
       coupon:coupon,
       amount:amount!
     },
      id:user?._id!
     })

     if("data" in res){
      toast.success(res.data.message)
      navigate('/admin/app/coupon')
     }
     else{
      const error=res.error as FetchBaseQueryError
      const message=(error.data as MessageResponse).message
      toast.error(message)
      setIsCopied(false)
    }
     setIsCopied(true);
    }
    else{
      setIsCopied(false);
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return alert("Please Select One At Least");



    let result: string = prefix || "";
    const loopLength: number = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum: number = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }
    
    setCoupon(result);
  };

  useEffect(() => {
    setIsCopied(false);

    if(data){
      setRows(data.AllCoupons.map((i)=>({
      Coupon:i.code, 
      Amount:i.amount,  
      action:<button onClick={async()=>{
        let a=confirm("Do you Want To Delete Coupon")
        if(a){
          try {
            const res=await deleteCoupon({
             couponId:i._id,
             userId:user?._id!
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
           toast.error("Coupon Doesn't Delete")
         }
        }
        else{
          return;
        }
      }}>
      <FaTrash />
    </button>
      })))
    }
  }, [coupon,data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "",
    "",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Text to include"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={25}
            />
            <input
              type="number"
              placeholder="Coupon Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={50}
              max={2000}
            />

            <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit">Generate</button>
          </form>

          {coupon && (
            <code>
              {coupon}{" "}
              <span onClick={() => copyText(coupon)}>
                {isCopied ? "Copied" : "Copy"}
              </span>{" "}
            </code>
          )}
        </section>
        <h1>All Coupons</h1>
         {
         isLoading?
         <Skeleton/>
         :
         <div>
         <main>{Table}</main>
         </div>
         }
      </main>
    </div>
  );
};

export default Coupon;