import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import httpsStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import userRoutes from "./modules/users/user.route";

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

// app.post();
app.use('/users/register', userRoutes)

export default app;