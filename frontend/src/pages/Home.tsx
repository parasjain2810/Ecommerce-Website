import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../components/Product-Cart'
import Loader from '../components/admin/Loader'
import { useLatestProductQuery } from '../redux/api/productApi'
import { addtoCart, calculate } from '../redux/reducer/cartReducer'
import { CartItem } from '../types/types'




const Home = () => {
  const dispatch=useDispatch();
  const {data,isLoading,isError}=useLatestProductQuery("")
  if(isError){
    toast.error("Cannot Fetch The Products");
  }
  const addToCartHandler=(cartItems:CartItem)=>{
      if(cartItems.stock<1) return toast.error("Out of Stock")
      if(cartItems.quantity>cartItems.stock) return toast.error("The Stock is Over for this Product")
      const a=dispatch(addtoCart(cartItems))
      dispatch(calculate())
      if(a) toast.success("Add To Cart")
  }
  return (
    <div className='home'>
      <section></section>
      <h1>
        Latest Product
        <Link to='/search' className='findmore'>
          More
        </Link>
      </h1>
        
      <main>
        {isLoading?<Loader/>:
         data?.products.map((i)=>(
          <ProductCard
          key={i._id}
          productId={i._id}
          name={i.name}
          photo={i.photo}
          price={i.price}
          stock={i.stock}
          handler={addToCartHandler}/>
        ))
        }
      </main>
    </div>
  )
}

export default Home
