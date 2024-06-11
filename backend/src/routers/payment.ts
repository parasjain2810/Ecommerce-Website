import express from 'express'
 const router=express.Router();

import { adminOnly } from '../middlewares/auth.js';
import { DeleteCoupon,createPayment, allCoupons, applyDiscount, newCoupon } from '../controller/payment.js';

router.post('/create',createPayment);
router.post('/coupon/new',adminOnly,newCoupon);
router.get ('/discount',applyDiscount);
router.get ('/coupons',adminOnly,allCoupons);
router.delete ('/:id',adminOnly,DeleteCoupon);



export default router;