import express from "express";
import {GameController} from "../game/gameController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
import {StatusController} from "../statistics/statusController.js";
export var gameRouter = express.Router()
const controller = new GameController();
const statusController = new StatusController();
gameRouter.use(jwtVerify);
gameRouter.post("/create",controller.createGame);
gameRouter.delete("/delete",controller.deleteGame);
gameRouter.post("/accept",controller.acceptGame);
gameRouter.post("/send-code",controller.sendGameCode);
gameRouter.post("/submit",controller.submitResults);
gameRouter.get("/open",statusController.openGames);
gameRouter.get("/live",statusController.liveGames);