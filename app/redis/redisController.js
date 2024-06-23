import { createClient } from 'redis';

export const redisClient = await createClient({
    url : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
