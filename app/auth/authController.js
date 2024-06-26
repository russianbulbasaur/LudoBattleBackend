import {Pool} from "../Database/pool.js";
import {firebaseVerify} from "./firebaseAuth.js";
import {generateToken} from "../middleware/jwtAuth.js";

export class AuthController{

    async verifyOTP(req,res){
        const {id,otp,phone} = req.query;
        if(!id || !otp || !phone){
            res.status(400).send("Id, otp, phone required");
            return;
        }
        let verified = await firebaseVerify(otp,phone,id);
        if(!verified){
            res.status(401).send("Invalid otp");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            const [rows, fields] = await connection.query(
                `select name,id,balance from users where phone=?`,
                [phone]);
            if(rows.length===0){
                res.status(200).send(JSON.stringify({"message":"VERIFIED"}));
                return;
            }
            const userID = rows[0]["id"];
            const name = rows[0]["name"];
            res.status(200).send(JSON.stringify({"message":"VERIFIED",
            "name":rows[0]["name"].toString(),
            "balance":rows[0]["balance"],"phone":phone,
            "id":rows[0]["id"],
            "token":(await generateToken(userID,name,phone)).toString()}));
        }catch (e){
            res.status(400).send(e);
        }
        finally {
            connection.release();
        }
    }



    async signup(req,res){
        const {name,phone,otp,id} = req.body;
        if(!name || !phone || !otp || !id){
            res.status(400).send("Name,phone,otp,id required");
            return;
        }
        const verified = true;
        if(!verified){
            res.status(401).send("Invalid otp");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select count(*) as count from users where phone=? for update`,
                [phone]);
            if(rows[0]["count"]!==0){
                res.status(400).send(JSON.stringify({"message":"User exists"}));
                return;
            }
            [rows,fields] = await connection.query(
                `insert into users(name,phone) values(?,?)`,
                [name,phone]);
            await connection.commit();
            const userID = rows["insertId"];
            res.status(200).send(JSON.stringify({"message":"VERIFIED",
            "name":name.toString(),"balance":0, "id":userID.toString(), "phone":phone,
            "token":(await generateToken(userID,name,phone)).toString()}));
        }catch(e){
            await connection.rollback();
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }
}