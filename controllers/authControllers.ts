import {type Request, type Response} from 'express'
import { LoginSchema, SignUpSchema } from '../config/zodSchema'
import { ResponseStatus } from '../config/enum'
import { prisma } from '../config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const jwtsecret = process.env.JWT_SECRET
if(!jwtsecret){
    throw new Error('jwt is not defined in env variables')
}

export const Signup = async(req: Request , res : Response) =>{
    const {email,password,name,role} = req.body
    const {success} = SignUpSchema.safeParse(req.body)
    try{
        if(!success){
            return res.status(ResponseStatus.error).json({mssg:"Enter valid details"})
        }
        const existingUser = await prisma.user.findUnique({where : {email}})
        if(existingUser){
            return res.status(ResponseStatus.error).json({mssg : "User already exists"})
        }
        const salt  = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        const user = await prisma.user.create({
            data : {
                email,
                name,
                password : hashPassword,
                role
            }
        })
        return res.status(ResponseStatus.created).json({
            mssg : "User Created",
            userId : user.id
        })
    }catch(err){
        console.log(err)
        return res.status(ResponseStatus.servererror).json("Internal Server Error")
    }    
}


export const Login = async(req: Request,res : Response) =>{
    const {email,password} = req.body
    const {success} = LoginSchema.safeParse(req.body)
    try{
        if(!success){
            return res.status(ResponseStatus.error).json({mssg:"Enter valid details"})
        }
        const user = await prisma.user.findUnique({where : {email}})
        if(!user){
            return res.status(ResponseStatus.forbidden).json({msg : "User not registered"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(ResponseStatus.unauthorized).json({msg : "Invalid Password"})
        }
        const token = jwt.sign({ userId : user.id , role : user.role},jwtsecret,{expiresIn : "4hr"}
        )
        return res.status(ResponseStatus.success).json({
            token,
            msg : "Login Successful",
            user : { userId : user.id , name : user.name, role : user.role}
        })
    }catch(err){
        return res.status(ResponseStatus.servererror).json({ msg : "Internal Server Error"})
    }
}