import express from 'express'
import { courseStats, createCourse, deleteCourse, getAllCourse, getCourseLessons, updateCourse } from '../controllers/courseControllers'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleGuard } from '../middlewares/roleGuard'

const router = express.Router()

router.use(authMiddleware)

router.get('/',getAllCourse)   // for the users to view all courses
router.post('/',roleGuard,createCourse)  // for instructor to create new couse
router.patch('/:courseId',roleGuard,updateCourse)  // for instructor to update course
router.get('/lessons/:courseId',getCourseLessons)  // to view the lessons within a course by user
router.delete('/:courseId',roleGuard,deleteCourse)    // for instructor to delete a  course
router.get('/stats/:courseId',roleGuard,courseStats)  // for instructor to get the course Stats


export default router




