import AsyncHandler from "../utils/AsyncHandler.js";
import { Url } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getDashboardStats = AsyncHandler(async (req, res) => {
     const urls  = await Url.find({ createdBy: req.user._id });

     if(!urls || urls.length === 0){
          throw new ApiError(404,"No urls found")
     }

     const stats =urls.map((url)=>{
          return{
               originalUrl:url.originalUrl,
               shortUrl:url.shortUrl,
               visitCount:url.vistCount
          }
     })
     res.status(200).json(new ApiResponse({stats}))
})