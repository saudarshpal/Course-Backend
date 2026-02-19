import { type Request, type Response, type NextFunction } from "express";
import { ResponseStatus } from "../config/enum";
import { Role } from "../generated/prisma/enums";

export const roleGuard  = (req:Request, res:Response , next : NextFunction)=>{
    if(!req.user){
        return res.status(ResponseStatus.forbidden).json({mssg : "Unauthorized : No user found"})
    }
    const targetRole = Role.instructor 
    if(req.user.role != targetRole || !req.user.userId){
        return res.status(ResponseStatus.forbidden).json({mssg : "Unauthorized : only instructor are allowed"})
    }
    next();
}