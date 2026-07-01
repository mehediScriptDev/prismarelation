
import httpsStatus from "http-status"
import { NextFunction, Request, RequestHandler, response, Response } from "express";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config";
import jwt from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";

type TMeta = {
        page:number;
        limit:number;
        total:number;
    }
type TResponseData<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data:T;
    meta?: TMeta

}

export const sendResponse = <T>(res:Response, data: TResponseData<T>)=>{
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.meta
    })
}

const createUser= catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const user= await userService.registerUserIntoDB(payload);

    sendResponse(res,{
        success:true,
        statusCode:httpsStatus.CREATED,
        message: "user registered successfully",
        data: {user}
    })
})

const getMe = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {accessToken} = req.cookies;
    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    if(typeof verifiedToken === "string"){
        throw new Error("Invalid token");
    }

const profile = await userService.getMeFromDB(verifiedToken.id);

    sendResponse(res,{
        success:true,
        statusCode:httpsStatus.OK,
        message: "user profile fetched successfully",
        data: {profile}
    })
})

const userController= {
    createUser,
    getMe
}
export default userController;