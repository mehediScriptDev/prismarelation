import { NextFunction, Request, RequestHandler, Response } from "express";
import httpsStatus from "http-status"

export const catchAsync = (fn:RequestHandler)=>{
    return async (req:Request,res:Response, next:NextFunction)=>{
        try {
            await fn(req,res,next);
        } catch (error) {
            res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
                message:"Failed to register user",
                error: (error as Error).message
            })
        }
    }
}