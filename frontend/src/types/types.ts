

export interface User{
    name:string,
    email:string,
    photo:string,
    _id:string,
    dob:string,
    gender:string,
    role:string
}

export interface UserReducerIntialState{
    user:User|null,
    loading:boolean
}

export type CartReducerIntialState={
    cartItems:CartItem[],
    subTotal:number,
    Shipping:number,
    tax:number,
    total:number,
    discount:number,
    loading:boolean,
    shippingInfo:ShippingInfo
}

export type CartItem={
    productId:string,
    photo:string,
    name:string,
    price:number,
    quantity:number,
    stock:number
}

export type ShippingInfo={
    address:string,
    city:string,
    state:string,
    country:string,
    pincode:number,
}

export interface UserResponse{
    user:User
}

export type AllUserResponse={
    success:boolean,
    users:User[]
}


export interface Product{
    _id: string,
    name: string,
    price: number,
    photo: string,
    stock: number,
    category: string,
    createdAt: string,
    updatedAt: string,
}
export interface NewProduct{
   id:string,
   formData:FormData,
}



export interface UpdateProduct{
    id:string,
    formData:FormData,
    userid:string
 }
 
export interface DeleteProduct{
    id:string,
    userid:string
 }
export interface DeleteUser{
    customer_id:string,
    userid:string
 }
export interface DeleteOrder{
    orderId:string,
    userid:string
 }
 

// export interface ProductReducerIntialState{
//     product:Product|null,
//     loading:boolean
// }

export interface ProductResponse{
    success:boolean,
    products:Product[]
}

export interface CustomError{
    status:Number,
    data:{
        success:boolean,
        message:string
    }
}

export interface CategoryResponse{
    success:boolean,
    categories:string[]
}

export interface SearchProduct{
    success:boolean,
    products:Product[],
    totalPage:number
}

export interface SearchQueryProduct{
    price:number
    page:number
    category:string,
    sort:string
    search:string
}

export interface NewProductResponse{
     success:boolean,
     message:string
}
export interface NewOrderResponse{
     success:boolean,
     message:string
}

export interface SingleProductResponse{
    success:boolean,
    product:Product
}

export type NewOrderRequest={
  shippingInfo:ShippingInfo,
  orderItems:CartItem[],
  subtotal:number,
  tax:number,
  total:number,
  discount:number,
  shippingCharges:number,
  user:string,
}

export type OrderItems=Omit<CartItem,"stock">&{_id:string}

export type Order={
   shippingInfo:ShippingInfo,
   _id: string,
   user: {
    name:string,
    _id:string
   },
   subtotal: number,
   shippingCharges: number,
   tax: number,
   discount: number,
   total: number,
   status: string,   
   orderItems:OrderItems[]  
}

export type UpdateOrderRequest={
    userId:string,
    orderId:string
}