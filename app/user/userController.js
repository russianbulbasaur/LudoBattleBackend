import {Pool} from "../Database/pool.js";

export class UserController{
    referralLink(){
        return undefined;
    }

    async changeName(req,res) {
        const {user} = req;
        const {name} = req.body;
        if(!name){
            res.status(400).send("Send new name");
            return;
        }
        let connection = await Pool.getConnection();
        await connection.query(`update users set name=? where id=?`,
            [name,user.id]);
        connection.release();
        res.status(200).send("Updated successfully");
    }

    deposit() {
        return undefined;
    }

    withdraw() {
        return undefined;
    }
}