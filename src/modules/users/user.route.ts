import { Router } from "express";
import userController from "./user.controller";

const router = Router();
router.post("/", userController.createUser)
 const userRoutes = router;
export default userRoutes;