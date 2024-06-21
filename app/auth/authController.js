import {Pool} from "../Database/pool.js";
import {escape} from "mysql2";


export class AuthController{

    generateToken(){

    }

    async verifyOTP(req,res){
        const {otp,id,phone} = req.params;
        let verified = await firebaseVerify(otp,id);
        if(verified) {
            const [rows, fields] = await Pool.run(
                `select count(*) as count,name 
                       from users where phone=?`, [phone]);
            if(rows[0]['count']===0){
                res.sendStatus(200).send(`{'message' : 'VERIFIED'}`);
            }else{
                res.sendStatus(200).send(`{'message' : 'VERIFIED',
                'name': ${rows[0]['name']},
                'token': ${this.generateToken()}`);
            }
        }else{
            res.sendStatus(401).send("Invalid otp");
        }

        async function firebaseVerify() {
            return true;
        }
    }


    signup(req,res){
        const {name,phone,otp,id} = req.body;
    }
}