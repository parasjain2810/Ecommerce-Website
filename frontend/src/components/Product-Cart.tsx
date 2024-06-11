import { FaPlus } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { CartItem } from '../types/types'

type ProductsProps={
  productId:string,
  photo:string,
  name:string,
  price:number,
  stock:number,
  handler:(cartItems: CartItem) => string | undefined
}//this is the props which means data type of variable used in the components 
const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}:ProductsProps) => {

  const dispatch=useDispatch();
  return (
    <div className='product-card'>
      <img src={`http://localhost:5000/${photo}`} alt={`${name}`} />
      {/* remember this when you use ` this then you can apply the javascript overther so always use {} brackets with them otherwise it show error */}
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={()=>{
          
            handler({productId,price,name,photo,stock,quantity:1})
            }}>
            <FaPlus/>
          </button>
      </div>
    </div>
   
  )
}

export default ProductCard
