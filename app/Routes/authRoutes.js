import express from "express";
import {AuthController} from "../auth/authController.js";
export var authRouter = express.Router();
const controller = new AuthController();

authRouter.get("/verify",controller.verifyOTP);

authRouter.post("/signup",controller.signup);

