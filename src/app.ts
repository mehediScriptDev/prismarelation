import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import httpsStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const app: Application = express();

app.use(cors({
    origin: "*",  // test only
    credentials: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!!");
});

app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password, profilePhoto } = req.body;

        const isUserExist = await prisma.user.findUnique({
            where: { email },
        });

        if (isUserExist) {
            res.status(httpsStatus.CONFLICT).json({ message: "User already exists" });
            return;
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
            include: { profile: true },
        });

        res.status(httpsStatus.CREATED).json({
            message: "User created successfully",
            data: { user },
        });

    } catch (error) {
        res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error,
        });
    }
});

export default app;