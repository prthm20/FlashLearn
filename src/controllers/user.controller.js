import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body
    console.log(name,email,password)
    
    if(name == ""){
        throw new ApiError(400,"name is required")
    }

    const existedUser = await User.findOne({ email })

    if(existedUser){
        throw new ApiError(409,"user with email already exists")
    }

    
    const user = await User.create({
        name,
        email,
        password,

    })
    await user.save();
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponse(200,"user created successfully",createdUser)
    )
})



export {registerUser}