import express from 'express'
const app=express();
import userRoutes from './routers/user.js'
import productRoutes from './routers/product.js'
import orderRoutes from './routers/orders.js'
import paymentRoutes from './routers/payment.js'
import dashboardRoutes from './routers/stats.js'
import { Dbconnection } from './config/Dbconnection.js';
import { errorMiddleware } from './middlewares/Error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
export const myCache =new NodeCache();//this is for speed up the fetching of data from database by saving it in the ram memory
import morgan from 'morgan';//it give the information about the request we do in our terminal 
import Stripe from 'stripe';
import cors from 'cors';

config({
    path:'./.env',
})
const PORT=process.env.PORT||5000;
const MONGO_DB=process.env.MONGO_DB||"";
const stripeKey=process.env.Stripe_key||"";

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin:"*",
    methods:["GET","PUT",'DELETE',"UPDATE","POST"],
    credentials:true
}));
Dbconnection(MONGO_DB);
export const stripe =new Stripe(stripeKey)

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product",productRoutes);
app.use("/api/v1/order",orderRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);
app.use('/uploads',express.static('uploads'))
app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log("Express running succesfully...")
})
