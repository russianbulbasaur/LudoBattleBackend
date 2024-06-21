import express from "express";
import {GameController} from "../game/gameController.js";
import {jwtVerify} from "../middleware/jwtAuth.js";
export var gameRouter = express.Router()
const controller = new GameController();

gameRouter.use(jwtVerify);