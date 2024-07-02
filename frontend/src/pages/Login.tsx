import  { useState } from 'react'
import toast from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useLoginMutation } from '../redux/api/userAPI';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { MessageResponse } from '../types/apiTypes';
import { sendVerificationEmail } from '../../../backend/src/utils/verificationEmail';

const Login = () => {
    const [gender,setgender]=useState<string>('');
    const [date,setDate]=useState<string>('');
    const navigate=useNavigate();
    const [login]=useLoginMutation();


    const loginHandler=async()=>{
      try {
       const provider=new GoogleAuthProvider();
       const {user}=await signInWithPopup(auth,provider)
       const res=await login({
        name:`${user.displayName}`,
        email:`${user.email}`,
        dob:date,
        _id:`${user.uid}`,
        gender:gender,
        role:"user",
        photo:`${user.photoURL}`
       })
       if("data" in res){
          navigate('/')
          toast.success(res.data.message)
       }else{
        const error=res.error as FetchBaseQueryError
        const message=(error.data as MessageResponse).message
        toast.error(message)
       }
      //  console.log(user);
      } catch (error) {
        toast.error("Authentication Failed")
      }
    }
  return (
    <div className='login'>
        <main>
        <button className='back-btn'  onClick={()=>navigate('/')}>
        <BiArrowBack/>
        </button>
          <h1>LOGIN</h1>
          <div>
            <label>Gender</label>
            <select name="gender"  value={gender} onChange={(e)=>{setgender(e.target.value)}}>
                <option value="">Select Gender</option>
                <option value="male">Men</option>
                <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label>Date of Birth</label>
             <input type="date" name="date" value={date} onChange={(i)=>{setDate(i.target.value)}}/>
          </div>

          <div>
            <p>Already Signed In Once</p>
            <button onClick={loginHandler}>
                <FcGoogle /><span>sign in with Google</span>
            </button>
          </div>
        </main>
    </div>
  )
}

export default Login
