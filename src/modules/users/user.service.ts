import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { error } from "node:console";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDB = async (payload:RegisterUserPayload)=>{
     const { name, email, password, profilePhoto } = payload;
    const isUserExist = await prisma.user.findUnique({
            where: { email },
        });

        if (isUserExist) {
            throw new Error("User already exists")
        }

        const hashedPassword = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds)
        );

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        await prisma.profile.create({
            data: {
                userId: createdUser.id,
                profilePhoto,
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: createdUser.id },
            omit:{password:true},
            include: { profile: true },
        });
return user;
}
const getMyProfile = async (userId:string)=>{
    const user = await prisma.user.findFirstOrThrow({
        where:{id:userId},
        omit:{password:true},
        include:{profile:true}
    })
    return user;
    
}
const getMeFromDB = async (userId:string)=>{}
const userService ={
    registerUserIntoDB,
    getMeFromDB
}
export default userService;