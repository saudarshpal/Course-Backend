import { type Request, type Response } from 'express'
import { ResponseStatus } from '../config/enum'
import { prisma } from '../config/db'
import { PurchaseCourseSchema } from '../config/zodSchema'


export const purchaseCourse = async(req:Request,res:Response) =>{
    const role = req.user?.role
    const userId = req.user?.userId
    const {courseId} = req.body
    if( role != "student"){
        return res.status(ResponseStatus.forbidden).json({mssg:"Unauthorized"})
    }
    const {success} = PurchaseCourseSchema.safeParse(req.body)
    if(!success || typeof userId != "string"){
        return res.status(ResponseStatus.error).json({mssg : "Validation Error"})
    }
    try{
        const purchase = await prisma.purchase.create({
            data : {
                userId,
                courseId
            }
        })
        res.status(ResponseStatus.success).json({
            mssg : "Purchased",
            purchase
        })
    }catch(err:any){
        if(err.code ==='P2002'){
            return res.status(ResponseStatus.forbidden).json({mssg : "Course Already Purchased"})
        }
        res.status(ResponseStatus.servererror).json({mssg : "internal server error"})
    }
}

export const userPurchases = async(req:Request, res : Response) =>{
    const userId = req.params.userId
    if ( !userId || typeof userId != "string"){
        return res.status(ResponseStatus.forbidden).json({mssg : "Unauthorized"})
    }
    try{
        const purchases = await prisma.user.findUnique({
        where : {id : userId},
        include : {
            purchases : true
            }
        })
        return res.status(ResponseStatus.success).json({
            mssg : "Your Purchases",
            purchases
        })
    }catch(err){
        return res.status(ResponseStatus.servererror).json({mssg : "Internal Server Error"})
    }
}