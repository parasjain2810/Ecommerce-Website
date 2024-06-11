import  { ChangeEvent, FormEvent, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { CartReducerIntialState } from '../types/types'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'
import { saveShippingInfo } from '../redux/reducer/cartReducer'

const Shipping = () => {
  const {cartItems,total}=useSelector((state:{cartReducer:CartReducerIntialState})=>state.cartReducer)
    const navigate=useNavigate()
    const dispatch=useDispatch();
    const [shippingInfo,setShippingInfo]=useState({
        address:"",
        city:"",
        pincode:0,
        state:"",
        country:""
    })
    const onChangeHandler=(e: ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
      setShippingInfo((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        dispatch(saveShippingInfo(shippingInfo))
        try {
          const {data}=await axios.post(`http://localhost:5000/api/v1/payment/create`,{
            amount:total
          },{
            headers:{
              "Content-Type":"application/json",
            }
          })

          navigate("/pay",{
            state:data.clientSecret
          })
        } catch (error) {
          console.log(error)
          toast.error("Something Went Wrong")
        }
    }

    if(cartItems.length<=0) return navigate('/cart')
  return (
    <div className='shipping'>
     <button className='back-btn'  onClick={()=>navigate('/cart')}>
        <BiArrowBack/>
     </button>
     <form onSubmit={submitHandler}>
     <h1>Shipping Adrress</h1>
       <input required type="text" placeholder='address' name='address' value={shippingInfo.address} onChange={onChangeHandler}/>
       <input required type="text" placeholder='city' name='city' value={shippingInfo.city} onChange={onChangeHandler}/>
       <input required type="text" placeholder='state' name='state' value={shippingInfo.state} onChange={onChangeHandler}/>
       <select name="country"  required value={shippingInfo.country} onChange={onChangeHandler}>
        <option value="">Choose Country</option>
        <option value="india">India</option>
       </select>
       <input required type="number" placeholder='pincode' name='pincode' value={shippingInfo.pincode} onChange={onChangeHandler}/>
       <button>Pay Now</button>
     </form>
    </div>
  )
}

export default Shipping
