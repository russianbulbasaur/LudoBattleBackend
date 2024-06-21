import express from "express";
import {UserController} from "../user/userController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
export var userRouter = express.Router()
const controller = new UserController();
const statusController = new StatusController();
userRouter.use(jwtVerify);
userRouter.post("/changename",controller.changeName);
userRouter.post("/deposit",controller.deposit);
userRouter.post("/withdraw",controller.withdraw);
userRouter.get("/referral",controller.referralLink);
userRouter.get("/rank",statusController.getRank);
userRouter.get("/leaderboard",statusController.leaderboard);
