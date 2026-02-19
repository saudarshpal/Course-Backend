import express from 'express'
import { createLessons } from '../controllers/lessonControllers'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleGuard } from '../middlewares/roleGuard'

const router = express.Router()

router.use(authMiddleware)

router.post('/',roleGuard,createLessons) //for instructor to create lessons

export default router