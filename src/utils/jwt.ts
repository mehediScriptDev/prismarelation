import jwt from "jsonwebtoken";

const verifyToken = (token:string,secretKey:string)=>{
    try {
        const verifiedToken = jwt.verify(token,secretKey);
    return verifiedToken;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

export const jwtUtils = {
    verifyToken
}