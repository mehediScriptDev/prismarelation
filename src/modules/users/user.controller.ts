
import httpsStatus from "http-status"
import { NextFunction, Request, RequestHandler, response, Response } from "express";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

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

const userController= {
    createUser
}
export default userController;