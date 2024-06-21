import jwt from 'jsonwebtoken';
const {verify} = jwt;
import 'dotenv/config.js'
export function jwtVerify(req,res,next){
    const token = req.headers.authorization;
    if(!token) res.sendStatus(401).send("No token provided");
    verify(token, process.env.JWT_SECRET,function(err,decoded){
        if(err){
            res.sendStatus(401).send("Token verification failed");
            return;
        }
        req.user = decoded;
        next();
    });
}

export async function generateToken(id,name,phone){
    return await jwt.sign({id,name,phone},process.env.JWT_SECRET);
}