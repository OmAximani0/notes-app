import { Router } from "express";
import { regsiterUser, loginUser } from "../services/user.service";

const userRouter = Router();

userRouter.post("/register", regsiterUser);

userRouter.post("/login", loginUser);

export default userRouter;
