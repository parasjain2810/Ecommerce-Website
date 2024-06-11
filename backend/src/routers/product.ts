import express from 'express'
 const router=express.Router();
import { adminOnly } from '../middlewares/auth.js';
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getSingleProduct, newProduct, updateProduct } from '../controller/product.js';
import { singleUpload } from '../middlewares/multer.js';


router.post("/new",adminOnly,singleUpload,newProduct);
router.get("/latest",getlatestProducts);
router.get("/all",getAllProducts);
router.get("/categories",getAllCategories);
router.get("/admin-product",adminOnly,getAdminProducts);
// router.get("/admin-product",getAdminProducts);
router.route("/:id").get(getSingleProduct).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,singleUpload,deleteProduct);

export default router;