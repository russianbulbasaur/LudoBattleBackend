import express from "express";
import {UserController} from "../user/userController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
import {StatusController} from "../statistics/statusController.js";
export var userRouter = express.Router()
const controller = new UserController();
const statusController = new StatusController();
userRouter.use(jwtVerify);
userRouter.post("/changename",controller.changeName);
userRouter.get("/balance",controller.getBalance);
userRouter.post("/deposit",controller.deposit);
userRouter.post("/withdraw",controller.withdraw);
userRouter.get("/history",controller.getHistory);
userRouter.get("/referral",controller.referralLink);
userRouter.get("/rank",statusController.getRank);
userRouter.get("/leaderboard",statusController.leaderboard);
