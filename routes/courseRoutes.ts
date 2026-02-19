import express from 'express'
import { courseStats, createCourse, deleteCourse, getAllCourse, getCourseLessons, updateCourse } from '../controllers/courseController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/',getAllCourse)   // for the users to view all courses
router.post('/',createCourse)  // for instructor to create new couse
router.patch('/:courseId',updateCourse)  // for instructor to update course
router.get('/lessons/:courseId',getCourseLessons)  // to view the lessons within a course by user
router.delete('/:courseId',deleteCourse)    // for instructor to delete a  course
router.get('/stats/:courseId',courseStats)  // for instructor to get the course Stats


export default router




