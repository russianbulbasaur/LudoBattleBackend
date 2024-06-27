import 'dotenv/config';
import {Pool} from "./Database/pool.js";
import {createLogger} from 'logger';
import 'dotenv/config'
import {redisClient} from "./redis/redisController.js";

//logs init
const logger = createLogger();
logger.debug("Initializing....");

//DB init
logger.debug("Initializing database");
Pool.init();

//Redis test
await redisClient.set("ankit","thakur");
const test = await redisClient.get('ankit');
if(test==="thakur") console.log("Redis connection successful");
await redisClient.del("ankit");