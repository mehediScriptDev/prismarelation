import { NextFunction, Request, Response, Router } from "express";
import userController from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { role } from "../../../generated/prisma/enums";

const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: role;
            };
        }
    }
}
router.post("/registration", userController.createUser)

const auth = (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Unauthorized: Access token is missing",
            data: null
        });
    }

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    if (typeof verifiedToken === "string") {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Unauthorized: Invalid access token",
            data: null
        });
    }

    req.user = {
        email: verifiedToken.email,
        name: verifiedToken.name,
        id: verifiedToken.id,
        role: verifiedToken.role
    };

    next();
}


router.get("/me",(req:Request,res:Response, next:NextFunction)=>{
   console.log(req.cookies);
    const {accessToken} = req.cookies;
       const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
       
        
       if(typeof verifiedToken === "string"){
           throw new Error("Invalid token");
       }
        const{email,name,id,role} = verifiedToken;
       const requiredRoles = [role.ADMIN,role.USER,role.AUTHOR];
       if(!requiredRoles.includes(role)){
        return res.status(403).json({
            success:false,
            statusCode:403,
            message:"Forbidden: You do not have permission to access this resource",
            data:null
        })
       }
       req.user = {email,name,id,role};
   next();
},userController.getMe)





 const userRoutes = router;
export default userRoutes;