import AsyncHandler from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from  "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT =AsyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user  = await User.findById(decodedToken.id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(400,"not a user token")
        }
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})