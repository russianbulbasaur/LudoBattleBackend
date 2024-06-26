import express from "express";
import {jwtVerify} from "../middleware/jwtAuth.js";
import {PaymentController} from "../payment/payment_controller.js";
export const paymentRouter = express.Router();
const paymentController = new PaymentController();

paymentRouter.use(jwtVerify);
paymentRouter.post("/create-order",paymentController.createDepositOrder);
paymentRouter.patch("/confirm-order",paymentController.confirmDepositOrder);
paymentRouter.post("/create-withdraw-request",paymentController.createWithdrawRequest);
paymentRouter.patch("/update-withdraw-request",paymentController.updateWithdrawRequest);