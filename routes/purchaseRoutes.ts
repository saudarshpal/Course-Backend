import express from 'express'
import { purchaseCourse, userPurchases } from '../controllers/purchaseControllers'
import { authMiddleware } from '../middlewares/authMiddleware'


const router = express.Router()

router.use(authMiddleware)

router.post('/',purchaseCourse)  //for user to purchase course
router.get('/users/:userId',userPurchases) //for user to view it purchases


export default router