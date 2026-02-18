import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes'
import courseRouter from './routes/courseRoutes'
import lessonRouter from './routes/lessonRoutes'
import purchaserouter from './routes/purchaseRoutes'
import { ResponseStatus } from './config/enum'


const app = express()



app.use(express.json())
app.use(cors())

app.use('/auth',authRouter)
app.use('/courses',courseRouter)
app.use('/lessons',lessonRouter)
app.use('/purchase',purchaserouter)

app.get('/serverUp',(req,res)=>{
    res.status(ResponseStatus.success).send("Server Up")
})


app.listen(3000,()=>{
    console.log("Backend is Running")
})