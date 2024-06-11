import mongoose from 'mongoose'
import validator from 'validator'

interface IUser extends Document{
    _id:string,
    name:string,
    email:string,
    photo:string,
    role:"admin"|"user",
    gender:"male"|"female",   
    dob:Date,
    createAt:Date,
    updateAt:Date,

    age:number
}

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"]
    },
    email:{
        type:String,
        required:[true,"Please enter the email"],
        unique:[true,'Email Already Exists'],
        validate:validator.default.isEmail //this function check whether the email is valid or not
    },
    dob:{
        type:Date,
        required:[true,"Please enter the Date"]
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    gender:{
        type:String,
        enum:["male","women"],
    },
    _id:{
        type:String,
        required:[true,"Please enter the ID"]
    },
    photo:{
        type:String,
        required:[true,"Please enter the photo"]
    },

},{timestamps:true})

schema.virtual('age').get(function (){
    const today=new Date()
    const dob:any=this.dob;
    let age=today.getFullYear()-dob.getFullYear();

    if(today.getMonth()<dob.getMonth()||(today.getMonth()==dob.getMonth()&&today.getDate()<dob.getDate()))
        {

            age--;
        }

     return age;
})

export const User=mongoose.model<IUser>("User",schema);
