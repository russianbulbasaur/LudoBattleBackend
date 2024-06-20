import express from "express";
import {UserController} from "../user/userController.js";
export var userRouter = express.Router()
const controller = new UserController();

userRouter.post("/changename",function () {
});

userRouter.post("/deposit",function (){});

userRouter.post("/withdraw",function(){});