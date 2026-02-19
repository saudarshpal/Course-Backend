import { prisma } from "../config/db";
import type { PaginationResult } from "../utils/pagination.utils";

export const getPaginatedCourses = async(
    page : number,
    limit : number,
    skip : number
) : Promise<PaginationResult<any>> =>{
    const[data,total] = await Promise.all([    //runing multiple asynchronous task at once
        prisma.course.findMany({
            skip,
            take : limit,
            select : {
                title : true,
                description : true,
                price : true,
                createdAt : true,
                instructor : {
                    select : {
                        name : true
                    }
                }
            },
            orderBy : {createdAt : 'desc'}
        }),
        prisma.course.count()
    ])
    return {data,total,page,limit}
}