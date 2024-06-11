import { myCache } from "../app.js";
import { Order } from "../model/order.js";
export const revalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productkeys = ["latest-product", "categories", "all-products"];
        if (typeof productId === 'string') {
            productkeys.push(`product-${productId}`);
        }
        if (typeof productId === 'object') {
            productId.forEach(i => { productkeys.push(`product-${i}`); });
        }
        myCache.del(productkeys);
    }
    if (order) {
        const orderkeys = ["getOrder", `single-order${orderId}`, `myorder-${userId}`];
        const orders = await Order.find({}).select('_id');
        orders.forEach(i => {
            orderkeys.push(`single-order${i._id}`);
        });
        myCache.del(orderkeys);
    }
};
