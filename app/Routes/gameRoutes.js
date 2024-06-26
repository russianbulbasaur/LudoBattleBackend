import express from "express";
import {GameController} from "../game/gameController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
import {StatusController} from "../statistics/statusController.js";
import multer from "multer";
export var gameRouter = express.Router()
const controller = new GameController();
const statusController = new StatusController();
const multerEngine = multer({dest:"uploads/screenshots"});

gameRouter.use(jwtVerify);
gameRouter.post("/create",controller.createGame);
gameRouter.delete("/delete",controller.deleteGame);
gameRouter.patch("/accept",controller.acceptGame);
gameRouter.patch("/send-code",controller.sendGameCode);
gameRouter.patch("/submit",multerEngine.single("screenshot"),controller.submitResults);
gameRouter.get("/open",statusController.openGames);
gameRouter.get("/live",statusController.liveGames);