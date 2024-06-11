import { Suspense, lazy, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Loading from './components/Loading';
import Header from './components/Header';
import Orders from './pages/Orders';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { getUser } from './redux/api/userAPI';
import { UserReducerIntialState, UserResponse } from './types/types';
import Loader from './components/admin/Loader';
import { ProtectedRoute } from './components/ProtectedRoute';
const OrderDetails =lazy(()=>import('./pages/OrderDetails')) ;
const UserProfile =lazy(()=>import('./pages/UserProfile')) ;
const CheckoutForm =lazy(()=>import('./pages/CheckoutForm')) ;
const Shipping =lazy(()=>import('./pages/Shipping')) ;
const Home =lazy(()=>import('./pages/Home')) 
const Search =lazy(()=>import('./pages/Search')) 
const Cart =lazy(()=>import('./pages/Cart')) 
const Login =lazy(()=>import('./pages/Login')) 
const ErrorPage =lazy(()=>import('./pages/ErrorPage')) 

//admin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);


function App() {

  const {user,loading}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer);
  const dispatch=useDispatch();
  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        const data:UserResponse=await getUser(user.uid)
        dispatch(userExist(data.user))
        // console.log('login');
      }else{
        dispatch(userNotExist());
        // console.log('Not login')
      }
    })
  })
  return loading?<Loader/>:<Router>
  <Header user={user}/>
  <Suspense fallback={<Loading/>}>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route path='/cart' element={<Cart/>}/>
    

    {/* NOT LOGGED IN ROUTE */}
    <Route>
    <Route path='/login' element={<ProtectedRoute isAuthenticate={user?false:true} children={<Login/>} redirect='/'/>}/>
    </Route>

    {/* LOGGED IN ROUTE */}
    <Route element={<ProtectedRoute isAuthenticate={user?true:false} redirect='/login'/>}>
      <Route path='/shipping' element={<Shipping/>}/>
      <Route path='/orders' element={<Orders/>}/>
      <Route path='/order/:id' element={<OrderDetails/>}/>
      <Route path='/pay' element={<CheckoutForm/>}/>
      <Route path='/profile' element={<UserProfile/>}/>
    </Route>
  




  {/* admin */}

  <Route
element={<ProtectedRoute isAuthenticate={user?true:false} adminOnly={true} isAdmin={user?.role==="admin"?true:false} redirect='/'/>}
>
<Route path="/admin/dashboard" element={<Dashboard />} />
<Route path="/admin/product" element={<Products />} />
<Route path="/admin/customer" element={<Customers />} />
<Route path="/admin/transaction" element={<Transaction />} />
{/* Charts */}
<Route path="/admin/chart/bar" element={<Barcharts />} />
<Route path="/admin/chart/pie" element={<Piecharts />} />
<Route path="/admin/chart/line" element={<Linecharts />} />
{/* Apps */}
<Route path="/admin/app/coupon" element={<Coupon />} />
<Route path="/admin/app/stopwatch" element={<Stopwatch />} />
<Route path="/admin/app/toss" element={<Toss />} />

{/* Management */}
<Route path="/admin/product/new" element={<NewProduct />} />

<Route path="/admin/product/:id" element={<ProductManagement />} />

<Route path="/admin/transaction/:id" element={<TransactionManagement />} />
</Route>

{/* // {Error Route} */}
<Route path='*' element={<ErrorPage/>}/>
</Routes>
</Suspense>
<Toaster position='bottom-center'/>
</Router>



}

export default App



