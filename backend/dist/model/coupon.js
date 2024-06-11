import mongoose from "mongoose";
const schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter the coupon"],
        unique: true
    },
    amount: {
        type: Number,
        required: [true, "Please enter the Amountr"]
    }
});
export const Coupon = mongoose.model("Coupon", schema);
