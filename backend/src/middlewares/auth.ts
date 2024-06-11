import { TryCatch } from "../middlewares/Error.js";
import { User } from "../model/user.js";
import ErrorHandler from "../utils/utility-class.js";
export const adminOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;

    if(!id){
        return next(new ErrorHandler("No id Found",405))
    }

    let user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("Login First",404))
    }
    
    if(user.role!=='admin'){
        return next(new ErrorHandler("You are not admin",406))
    }

    next();
})