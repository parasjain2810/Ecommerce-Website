import { FormEvent, useState } from 'react'
import {Elements,PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {NewOrderRequest} from '../types/types';
import { RootState } from '../redux/store';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { resetCart } from '../redux/reducer/cartReducer';

const stripePromise = loadStripe('pk_test_51N3w3SFYKXgwZPyebOXd8UzKlwsWmvtUhBA44wOcAobexbftj7dXvP23g8Ibp5ttngJfeLXiN4EwD8a0177VgtnY00SUOOnqXx');
const Checkout=()=>{
  const stripe=useStripe() 
  const elements=useElements()
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const {user}=useSelector((state:RootState)=>state.userReducer)
  const {shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    Shipping,
    total}=useSelector((state:RootState)=>state.cartReducer)
  const [isProcessing,setIsProcessing]=useState<boolean>(false)
  const [newOrder]=useNewOrderMutation();
  const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!stripe||!elements) return ;
    setIsProcessing(true);

    const orderData:NewOrderRequest={
      shippingInfo,
    orderItems:cartItems,
    subtotal:subTotal,
    tax,
    discount,
    shippingCharges:Shipping,
    total,
    user:user?._id!
    }

    const {paymentIntent,error}=await stripe.confirmPayment({
      elements,
      confirmParams:{return_url:window.location.origin},
      redirect:"if_required"
    })

    if(error) {
      setIsProcessing(false);
      return toast.error(error.message||"Something went Wrong")
    }
    if(paymentIntent.status==="succeeded"){
      await newOrder(orderData)
      dispatch(resetCart())
      toast.success("Order Place Successfull")
      navigate("/orders")
    }
    setIsProcessing(false);
  }

  return (
    <div className='checkout-container'>
      <form onSubmit={submitHandler}>
      <PaymentElement/>
      <button type='submit' disabled={isProcessing}>{isProcessing?"Processing":"Pay"}</button>
    </form>
  </div>
  )
}
const CheckoutForm = () => {

  const location=useLocation();
  const clientSecret:string|undefined=location.state;
  if(!clientSecret) return <Navigate to={"/shipping"} />
  return (<Elements stripe={stripePromise} options={{
    clientSecret:clientSecret
  }}><Checkout/></Elements>)
  
}

export default CheckoutForm

aaaa