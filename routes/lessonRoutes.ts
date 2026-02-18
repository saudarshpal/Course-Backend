import express from 'express'
import { createLessons } from '../controllers/lessonControllers'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.post('/',createLessons)

export default router