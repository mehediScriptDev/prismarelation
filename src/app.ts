import cors from "cors";
import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import config from "./config";
import httpsStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { profile } from "node:console";

const app:Application = express();

app.use(cors({
    origin:config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.get('/',(req:Request,res:Response)=>{
    res.send("Hello world!!");
})

app.post('/api/users/register',async (req:Request,res:Response)=>{
const {name,email,password,profilePhoto} = req.body;
const isUserExist = await prisma.user.findUnique({
    where:{email}
})
if(isUserExist){
    throw new Error("User already exists")
}
const hashedpassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

const createdUser = await prisma.user.create({
    data:{
        name,
        email,
        password:hashedpassword
    }
});
await prisma.profile.create({
    data:{
        userId: createdUser.id,
        profilePhoto
    }
})
const user = await prisma.user.findUnique({
    where:{
        id: createdUser.id,
        email:createdUser.email||email
    },
    include:{
        profile: true
    }
}
)

res.status(httpsStatus.CREATED).json({meesage:"founda",data:{
    user
}})

})


export default app;