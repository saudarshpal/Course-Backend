import { type Request,type Response } from "express";
import { prisma } from "../config/db";
import { ResponseStatus } from "../config/enum";
import { CreateCourseSchema } from "../config/zodSchema";


export const getAllCourse = async(req:Request , res:Response)=>{
    try{
        const courses = await prisma.course.findMany({
            select  : {
                id : true ,
                title : true,
                description : true,
                price : true,
                createdAt : true ,
                instructor : {
                    select : {
                        id : true,
                        name : true
                    }
                }

            }
        })
        return res.status(ResponseStatus.success).json({
            mssg : "Courses Fectched",
            courses
        })
    }catch(err){
        res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}

export const createCourse = async(req:Request,res:Response)=>{
    const role = req.user?.role
    const instructorId = req.user?.userId
    const {title,description,price} = req.body
    const {success} = CreateCourseSchema.safeParse(req.body)
    if(!success){
        return res.status(ResponseStatus.error).json({mssg : "Validation Error"})
    }
    if(role != "instructor" || !instructorId){
        return res.status(ResponseStatus.forbidden).json({mssg : "not an instructor"})
    }
    try{
        const course = await prisma.course.create({
        data :{
            title,
            description,
            price,
            instructorId
        }
    })
        return res.status(ResponseStatus.created).json({mssg : "Course Created"})
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}

export const getCourseLessons = async(req:Request,res:Response)=>{
    const {courseId}  = req.params
    if(!courseId || typeof courseId != "string" ){
        return res.status(ResponseStatus.notfound).json({msg : "Bad GateWay"})
    }
    try {
        const courses = await prisma.course.findUnique({
            where : { id : courseId },
            include : {
                lessons : true
            }
        })
        if(!courses) return res.status(ResponseStatus.notfound).json({mssg : "course not found"})
        res.status(ResponseStatus.success).json({
            mssg: "Lessons Fetched",
            courses
        })
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
  }
}



export const updateCourse  = async(req:Request,res:Response)=>{
    const data = req.body
    const {courseId} = req.params
    const role = req.user?.role
    const instructorId = req.user?.userId
    if(!courseId || typeof courseId != "string" || role != "instructor" || !instructorId){
        return res.status(ResponseStatus.notfound).json({msg : "unauthorised/Bad gateway"})
    }
    try{
        const course = await prisma.course.findUnique({
            where : {id : courseId}
    })
        if( !course || course.instructorId !== instructorId){
            return res.status(ResponseStatus.notfound).json({mssg : "unauthorised/Bad gateway"})
    }
        const updatedCourse = await prisma.course.update({
            where : {id : courseId},
            data: {
                ...data,
                updatedAt: new Date(),
        },
    })
        return res.status(ResponseStatus.success).json({ 
            msg: "Course updated",
            course: updatedCourse,
    });

    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}


export const deleteCourse  = async(req:Request,res:Response)=>{
    const {courseId} = req.params
    console.log(courseId)
    if(!courseId || typeof courseId != "string" ){
        return res.status(ResponseStatus.notfound).json({msg : "Bad GateWay"})
    }
    try{
        await prisma.course.delete({
            where : {id : courseId}
        })
        return res.status(ResponseStatus.success).json({msg : "course deleted"})
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}



