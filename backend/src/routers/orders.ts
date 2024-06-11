import express from 'express'
 const router=express.Router();
import {} from '../controller/user.js';
import { adminOnly } from '../middlewares/auth.js';
import { deleteOrder, getOrders, getSingleOrder, myOrder, newOrder, processOrder } from '../controller/orders.js';

router.post('/new',newOrder);
router.get('/admin-order',adminOnly,getOrders);
router.get('/my-order',myOrder);
router.get('/:id',getSingleOrder);
router.route('/:id').get(getSingleOrder).delete(adminOnly,deleteOrder).put(adminOnly,processOrder);



export default router;