import { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/Cart-items';
import { Skeleton } from '../components/Loading';
import { CartReducerIntialState } from '../types/types';
import { calculate, discountApplier } from '../redux/reducer/cartReducer';
import axios from 'axios';


const Cart = () => {


  const [couponCode,setCouponCode]=useState<string>("");
  const [IsValidcouponCode,setIsValidcouponCode]=useState<boolean>(true);
  const {Shipping,cartItems,discount,loading,subTotal,tax,total}=useSelector((state:{cartReducer:CartReducerIntialState})=>state.cartReducer)
  const dispatch=useDispatch();
  
  
  useEffect(() => {
    const {token ,cancel}=axios.CancelToken.source();//jb hume axios ki request nhi bhejni ho tb use krte hai
    const timeoutId=setTimeout(()=>{
      axios
      .get(`http://localhost:5000/api/v1/payment/discount?coupon=${couponCode}`,{cancelToken:token})
      .then((res)=>{
        dispatch(discountApplier(res.data.Discount))
        dispatch(calculate());
        setIsValidcouponCode(true)
      })
      .catch((e)=>{
        dispatch(discountApplier(0))
        dispatch(calculate());
        setIsValidcouponCode(false);
      })
    },1000);
    
    return () => {
      clearTimeout(timeoutId);
      cancel()
      setIsValidcouponCode(false);
    }
  }, [couponCode])//ye islie use kiya hai ki agaar couponcode mai change ho then wo continously ki checkout krta rahe 
 
  useEffect(()=>{
    dispatch(calculate());
  },[cartItems])
   
  return (
    <div className='cart'>
      <main>
        {cartItems.length>0?loading?<Skeleton/>:
        (
          cartItems.map((i,index)=>
           (
             <CartItem cartItems={i} key={index}/>
           ))
         ):(
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
       <p>Subtotal : ₹{subTotal}</p>
       <p>shipping Charges : ₹{Shipping}</p>
       <p>Tax : ₹{tax}</p>
       <p>Discount-<em>₹{discount}</em></p>
       <p>
        <b>Total: ₹{total}</b>
       </p>
       <input type="text" onChange={(i)=>setCouponCode(i.target.value)} value={couponCode} placeholder='Coupon Code'/>

       
        {
        couponCode&&(
          IsValidcouponCode? <span className='green'>₹{discount} off using the <code>{couponCode}</code></span>:
        <span className='red'>invalid Coupun Code <VscError/></span>
        )
        }
       
       {cartItems.length>0&& <Link to='/shipping'>Checkout</Link>}
      </aside>
    </div>
  )
}

export default Cart
