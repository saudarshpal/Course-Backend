import { type Request,type Response } from "express";
import { prisma } from "../config/db";
import { ResponseStatus } from "../config/enum";
import { CreateCourseSchema } from "../config/zodSchema";
import { paginationOptions } from "../utils/pagination.utils";
import { getPaginatedCourses } from "../services/courseServices";


export const getAllCourse = async(req:Request , res:Response)=>{
    try{
        const {page,limit,skip} = paginationOptions(req.query.page,req.query.limit)

        const result = await getPaginatedCourses(page,limit,skip)

        return res.status(ResponseStatus.success).json(result)
    }catch(err){
        res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}

export const createCourse = async(req:Request,res:Response)=>{
    const instructorId = req.user?.userId
    const {title,description,price} = req.body
    const {success} = CreateCourseSchema.safeParse(req.body)
    if(!success || !instructorId){
        return res.status(ResponseStatus.error).json({mssg : "Validation Error"})
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
        return res.status(ResponseStatus.created).json({
            mssg : "Course Created",
            course
        })
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
    const instructorId = req.user?.userId
    if(!courseId || typeof courseId != "string" ){
        return res.status(ResponseStatus.notfound).json({msg : "Validation Error"})
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

export const courseStats = async(req:Request , res:Response)=>{
    const {courseId} = req.params
    if( typeof courseId !="string"){
        return res.status(ResponseStatus.forbidden).json({mssg:"Validation error"})
    }
    try{
        const course = await prisma.course.findUnique({
            where : {id : courseId},
            select :{
                price : true,
                purchased : true
            }
        })
        if(!course || !course.price || !course.purchased){
            return res.status(ResponseStatus.notfound).json({msg : "Course Not Found"})
        }
        const coursePrice = course?.price
        const totalPurchase = course?.purchased.length
        const totalRevenue = coursePrice * totalPurchase
        return res.status(ResponseStatus.success).json({
            msg :"Course Stats",
            coursePrice,
            totalPurchase,
            totalRevenue
        })
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : " Internal Server Error"})
    }
}


