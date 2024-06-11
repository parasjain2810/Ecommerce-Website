import  { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FaSearch,FaShoppingBag,FaSignInAlt,FaUser,FaSignOutAlt} from 'react-icons/fa'
import { User } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

interface PropsType{
  user:User|null
}
const Header = ({user}:PropsType) => {

    const navigate=useNavigate();
    const logoutHandler=async()=>{
      try {
        await signOut(auth);
        toast.success("Logout Successfully");
        setIsopen(false);
        navigate('/login');
      } catch (error) {
        toast.error("Logout Failed")
      }
    }


    const [isOpen,setIsopen]=useState<boolean>(false);
  return (
    <nav className='header'>
      <Link to='/' onClick={()=>setIsopen(false)}>Home</Link>
      <Link to='/search' onClick={()=>setIsopen(false)}><FaSearch/></Link>
      <Link to='/cart' onClick={()=>setIsopen(false)}><FaShoppingBag/></Link>
      
      {user?._id?(
        <>
        <button onClick={()=>setIsopen((prev)=>!prev)}>
            <FaUser />
        </button>
         <dialog open={isOpen}>
            <div>
            {user.role=='admin'&&(<Link to='/admin/dashboard' onClick={()=>setIsopen(false)}>Admin</Link>)}
            <Link to='/orders'  onClick={()=>setIsopen(false)}>Order</Link>
            <Link to='/profile'  onClick={()=>setIsopen(false)}>Profile</Link>
            <button onClick={()=>{
            logoutHandler()
            setIsopen(false)}} >
                <FaSignOutAlt/>
            </button>
            </div>
         </dialog>
        </>
      ):(
        <>
        <Link to='/login'>
        <FaSignInAlt/>
        </Link>
        </>
      )}
    </nav>
  )
}   

export default Header
