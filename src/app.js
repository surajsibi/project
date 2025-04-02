import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




//imports


import userRouter from "./routes/user.route.js"
import urlRouter from "./routes/url.route.js"



//routesDeclation 

app.use("/api/v1/user",userRouter)
app.use("/api/v1/url",urlRouter)


export {app}