import { TryCatch } from "../middlewares/Error.js";
import { Order } from "../model/order.js";
import { reduceStock } from "../utils/reduceStock.js";
import { revalidateCache } from "../utils/revalidate.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, discount, shippingCharges, total } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
        return next(new ErrorHandler("Please Fill all the fields", 401));
    }
    const newOrder = await Order.create({
        shippingInfo, orderItems, user, subtotal, tax, discount, shippingCharges, total
    });
    await reduceStock(orderItems);
    await revalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: newOrder.orderItems.map(i => String(i.productId))
    });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
});
export const getOrders = TryCatch(async (req, res, next) => {
    let order;
    if (myCache.has('getOrders')) {
        order = JSON.parse(myCache.get('getOrders'));
    }
    else {
        order = await Order.find({}).populate("user", "name");
        if (!order) {
            return next(new ErrorHandler("No Order Found", 201));
        }
        myCache.set('getOrders', JSON.stringify(order));
    }
    return res.status(201).json({
        success: true,
        order
    });
});
export const myOrder = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    //this is the user ID 
    let order = [];
    if (myCache.has(`myorder-${user}`)) {
        order = JSON.parse(myCache.get(`myorder-${user}`));
    }
    else {
        order = await Order.find({ user: user }).populate("user", "name");
        if (!order)
            return next(new ErrorHandler('No order Id found', 301));
        myCache.set(`myorder-${user}`, JSON.stringify(order));
    }
    return res.status(208).json({
        success: true,
        order
    });
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let order;
    if (myCache.has(`single-order${id}`)) {
        order = JSON.parse(myCache.get(`single-order${id}`));
    }
    else {
        order = await Order.findById(id).populate('user', 'name');
        if (!order)
            return next(new ErrorHandler('No order found', 501));
        myCache.set(`single-order${id}`, JSON.stringify(order));
    }
    return res.status(210).json({
        success: true,
        order
    });
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("No Id found", 501));
    switch (order.status) {
        case "processing":
            order.status = "shipped";
            break;
        case "shipped":
            order.status = "delivered";
            break;
        default:
            order.status = "delivered";
            break;
    }
    await order.save();
    await revalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
    return res.status(211).json({
        success: true,
        message: "Order Process Successfull"
    });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("No id Found", 506));
    await revalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
    await order.deleteOne();
    return res.status(211).json({
        success: true,
        message: "Order Deleted Successfull"
    });
});
