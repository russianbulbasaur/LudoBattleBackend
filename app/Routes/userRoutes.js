import express from "express";
import {UserController} from "../user/userController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
export var userRouter = express.Router()
const controller = new UserController();

userRouter.use(jwtVerify);
userRouter.post("/changename",function (req,res) {
});

userRouter.post("/deposit",function (){});

userRouter.post("/withdraw",function(){});