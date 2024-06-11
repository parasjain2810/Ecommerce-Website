import mongoose from "mongoose";
import {config} from 'dotenv'

config({
    path:'./.env'
})

export const Dbconnection=async(url:string)=>{
    try {
       await mongoose.connect(url,{
            dbName:"Jain_Ecommerce"
        })
        console.log("DB connection successfull");
    } catch (error) {
        console.log('Db Connection Failed');
    }
}
