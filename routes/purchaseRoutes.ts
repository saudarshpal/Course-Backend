import express from 'express'
import { purchaseCourse, userPurchases } from '../controllers/purchaseControllers'
import { authMiddleware } from '../middlewares/authMiddleware'


const router = express.Router()

router.use(authMiddleware)

router.post('/',purchaseCourse)
router.get('/users/:userId',userPurchases)


export default router