import { type Request , type Response , type NextFunction, request} from 'express'
import jwt,{type JwtPayload} from 'jsonwebtoken'
import { ResponseStatus } from '../config/enum'


declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}
interface AuthPayload extends JwtPayload {
  userId: string;
  role: string;
}

const jwtsecret = process.env.JWT_SECRET

if(!jwtsecret){
    throw new Error("jwt secret not defined in env variables")
}

export const authMiddleware = async(req : Request, res:Response, next:NextFunction)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(ResponseStatus.unauthorized).json({msg : "Unauthorized"})
    }
    const token = authHeader.split(' ')[1]
    if(!token){
        return res.status(ResponseStatus.unauthorized).json({msg : "Unauthorized"})
    }
    try{
        const decoded = jwt.verify(token,jwtsecret) as AuthPayload
        req.user = {
            userId : decoded.userId,
            role : decoded.role
        } 
        next()
    }catch(err){
        return res.status(ResponseStatus.servererror).json("Internal Server Error")
    }


}