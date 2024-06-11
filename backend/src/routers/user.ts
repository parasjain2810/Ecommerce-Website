import express from 'express'
 const router=express.Router();
import {getAllUsers, newUser,getUser,deleteUser} from '../controller/user.js';
import { adminOnly } from '../middlewares/auth.js';


router.post('/new',newUser);
router.get('/all',adminOnly,getAllUsers);

router.route('/:id').get(getUser).delete(adminOnly,deleteUser);

// router.get('/:id',getUser);
// router.delete('/:id',deleteUser);

export default router;