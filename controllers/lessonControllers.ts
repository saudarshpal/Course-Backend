import {type Request, type Response} from 'express'
import { ResponseStatus } from '../config/enum'
import { prisma } from '../config/db'
import { CreateLessonSchema } from '../config/zodSchema'

export const createLessons = async(req:Request, res:Response) =>{
    const role = req.user?.role
    const instructorId = req.user?.userId
    const {title,content,courseId}  = req.body
    const {success} = CreateLessonSchema.safeParse(req.body)
    if(!success){
        return res.status(ResponseStatus.error).json({mssg : "Validation error"})
    }
    if( role != "instructor" || !instructorId ){
        return res.status(ResponseStatus.unauthorized).json({mssg : "Unauthorized"})
    }
    try {
        const lesson = await prisma.lesson.create({
            data : {
                title,
                content,
                courseId
            }
        })
        return res.status(ResponseStatus.success).json({
            mssg : "Lesson created",
            lesson
        })
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal server error"})
    }
}

