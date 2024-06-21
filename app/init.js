import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import 'dotenv/config';
import {Pool} from "./Database/pool.js";
import {createLogger} from 'logger';
import 'dotenv/config'

//logs init
const logger = createLogger();
logger.debug("Initializing....");

//firebase init
logger.debug("Initializing firebase");
const firebaseConfig = {

    apiKey: process.env.API_KEY,

    authDomain: "ludo-79ca7.firebaseapp.com",

    projectId: "ludo-79ca7",

    storageBucket: "ludo-79ca7.appspot.com",

    messagingSenderId: "1053574719667",

    appId: "1:1053574719667:web:6050b4fc3a69ac515528c6",

    measurementId: "G-SJB6J99LTF"

};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//DB init
logger.debug("Initializing database");
Pool.init();