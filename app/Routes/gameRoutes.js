import express from "express";
import {GameController} from "../game/gameController.js";
export var gameRouter = express.Router()
const controller = new GameController();
