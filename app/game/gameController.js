import {Pool} from "../Database/pool.js";

export class GameController{

    async createGame(req,res) {
        const {user} = req;
        const {amount} = req.body;
        let connection = await Pool.getConnection();
        await connection.beginTransaction();
        let [rows,fields] = await
            connection.query(`select balance from users where id=? for update`,
                [user.id]);
        const userBalance = rows[0]['balance'];
        if(userBalance<amount){
            await connection.commit();
            await connection.release();
            res.status(404).send(`{'message':'Not enough balance'}`);
            return;
        }
        await connection.query(`update users set balance=? where id=?`,
            [userBalance-amount,user.id]);
        [rows,fields] =
            await connection.query(`insert into `+
            `games(host_id,amount,winning_amount,status)`+
        `values(?,?,?,?)`,[user.id,amount,amount,'open']);
        await connection.commit();
        res.status(200).send(`{'message' : 'Game created',`+
                              `'game_id':${rows['insertId']}}`);
    }

    async deleteGame() {
    }

    async acceptGame(req,res) {
        const {user} = req;
        const {game_id} = req.body;

    }

    async submitResults() {
        return undefined;
    }
}