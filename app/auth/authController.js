import {Pool} from "../Database/pool.js";
import {firebaseVerify} from "./firebaseAuth.js";
import {generateToken} from "../middleware/jwtAuth.js";

export class AuthController{

    async verifyOTP(req,res){
        const {id,otp,phone} = req.query;
        let verified = await firebaseVerify(id,otp);
        if(verified) {
            let connection = await Pool.getConnection();
            const [rows, fields] = await connection.query(
                `select name,id from users where phone=?`,
                [phone]);
            if(rows.length===0){
                res.status(200).send(`{'message' : 'VERIFIED'}`);
            }else{
                const userID = rows[0]['id'];
                const name = rows[0]['name'];
                res.status(200).send(`{'message' : 'VERIFIED',`+
                `'name': ${rows[0]['name']},`+
                `'token': ${await generateToken(userID,name,phone)}}`);
            }
        }else{
            res.status(401).send("Invalid otp");
        }
    }



    async signup(req,res){
        const {name,phone,otp,id} = req.body;
        const verified = await firebaseVerify(id,otp);
        if(verified){
            let connection = await Pool.getConnection();
            let [rows,fields] = await connection.query(
                `select count(*) as count from users where phone=?`,
                [phone]);
            if(rows[0]['count']!==0){
                res.status(400).send(`{'message' : 'User exists'}`);
                return;
            }
            [rows,fields] = await connection.query(
                `insert into users(name,phone) values(?,?)`,
                [name,phone]);
            const userID = rows['insertId'];
            res.status(200).send(`{'message' : 'VERIFIED',`+
                `'name': ${name},`+
                `'token': ${await generateToken(userID,name,phone)}`);
        } else{
            res.status(401).send("Invalid otp");
        }
    }
}