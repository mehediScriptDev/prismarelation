import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { Iuser } from "./auth.interface"
import { error } from "node:console";

const loginUser = async (payload:Iuser)=>{
 const {email,password} = payload;

 const user = await prisma.user.findUniqueOrThrow({
    where :{email}
 })
 const isPasswordMatched = await bcrypt.compare(password, user.password);

 if(!isPasswordMatched){
    throw new Error("Password is incorrect");
 }
 return user;
}

export const authService = {
    loginUser
}