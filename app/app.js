import './init.js'
import express from "express";
import {authRouter} from "./Routes/authRoutes.js";
import {gameRouter} from "./Routes/gameRoutes.js";
import {userRouter} from "./Routes/userRoutes.js";
import 'dotenv/config'
const app = express()

app.use('/auth',authRouter);
app.use('/game',gameRouter);
app.use('/user',userRouter);

app.listen(process.env.PORT,function () {
    console.log(`Listening on port ${process.env.PORT}`);
});