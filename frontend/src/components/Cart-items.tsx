import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { calculate, decrementQunatity, deleteProduct, incrementQuantity } from '../redux/reducer/cartReducer';
type CartItemProp={
  cartItems:any;
};
const CartItem = ({cartItems}:CartItemProp) => {

   
  const {name,productId,photo,price,quantity,stock}=cartItems
     const dispatch=useDispatch();
     const decrementHandler=()=>{
       if(quantity<=1) return toast.error("Select AtLeast One Product")
       dispatch(decrementQunatity(productId))
      dispatch(calculate())
     }
     const incrementHandler=()=>{
       if(stock<=quantity) return toast.error("Stock is Over for this Product")
       dispatch(incrementQuantity(productId))
       dispatch(calculate())
     }
     const deleteHandler=()=>{
      dispatch(deleteProduct(productId))
      dispatch(calculate())
     }
  return (
    <div className='cart-item'>
      <img src={`http://localhost:5000/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>{price}</span>
      </article>
       
       <div>
        <button onClick={decrementHandler}>-</button>
        <p>{quantity}</p>
        <button onClick={incrementHandler}>+</button>
       </div>

       <button  onClick={deleteHandler}>
        <FaTrash/>
       </button>
    </div>
  )
}

export default CartItem
