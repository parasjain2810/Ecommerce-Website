import express from 'express'
const router=express.Router();

import { adminOnly } from '../middlewares/auth.js';
import { getDashBoardBar, getDashBoardLine, getDashBoardPie, getDashBoardStats } from '../controller/stats.js';

router.get('/stats',adminOnly,getDashBoardStats)
router.get('/pie',adminOnly,getDashBoardPie)
router.get('/line',adminOnly,getDashBoardLine)
router.get('/bar',adminOnly,getDashBoardBar)


export default router;