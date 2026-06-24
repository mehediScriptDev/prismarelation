import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import httpsStatus from "http-status"
import { Request, Response } from "express";
import { create } from "node:domain";
import userService from "./user.service";

const createUser =async (req: Request, res: Response) => {
    
       const payload = req.body;

       const user = await userService.registerUserIntoDB(payload);

        
        res.status(httpsStatus.CREATED).json({
            message: "User created successfully",
            data: { user },
        });

   
}

const userController= {
    createUser
}
export default userController;