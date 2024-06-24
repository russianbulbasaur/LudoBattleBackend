import {Pool} from "../Database/pool.js";

export class UserController{
    referralLink(){
        return undefined;
    }

    async getHistory(req,res){
        const {user} = req;
        let {tab,offset} = req.params;
        if(!tab){
            res.status(400).send("Tab required");
            return;
        }
        let query = "";
        let params = [];
        if(!offset) offset = 0;
        switch(tab){
            case "games":
                query = `select * from games where host_id=? or player_id=? `+
                    `order by created_at desc offset ? limit 10`;
                params = [user.id,user.id,offset];
                break;
            case "transactions":
                query = `select * from transactions where user_id=? order by created_at desc`+
                    ` offset ? limit 10`;
                params = [user.id,offset];
                break;
            case "referrals":
                break;
        }
        let connection = Pool.getConnection();
        try{
            const [rows,fields] = await connection.query(
                query,
                params
            );
            res.status(400).send(rows);
        }catch (e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
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