import {Pool} from "../Database/pool.js";
import {redisClient} from "../redis/redisController.js";

export class StatusController{

    async openGames(req,res) {
        const {user} = req;
        let connection = await Pool.getConnection();
        const [rows, fields] = await connection.query(
            `select games.*,users.name as hostName from games inner join users on `+
            `users.id=games.host_id where status=? or (host_id=? and status=?)`,
            ["open",user.id,"waiting"]);
        connection.release();
        res.status(200).send(rows);
    }

    async liveGames(req,res) {
        const {offset} = req.query;
        let connection = await Pool.getConnection();
        let [rows,fields] = [];
        if(!offset) {
            [rows, fields] = await connection.query(
                `select games.amount as amount,u1.name as player1,u2.name as player2 from games `+
                `inner join users u1 on u1.id=games.host_id `+
                `inner join users u2 on u2.id=games.player_id `+
                `where status=? limit 10`,
                ["playing"]);
        }else{
            [rows,fields] = await connection.query(
                `select * from games where status=? and id between ? and ?`,
                ["playing",offset+1,offset+10]
            );
        }
        connection.release();
        res.status(200).send(rows);
    }

    async getRank(req,res) {
        const {user} = req;
        try {
            const rank = await
                redisClient.sendCommand(["zscore","leaderboard",user.id.toString()]);
            res.status(200).send(JSON.stringify({"rank":rank}));
        }catch (e){
            res.status(400).send(e);
        }
    }

    async leaderboard(req,res) {
        try{
            const board = await
                redisClient.sendCommand(
                    ["zrange","leaderboard","0","10","withscores","rev"]);
            res.status(200).send(JSON.stringify(board));
        }catch (e){
            res.status(400).send(e);
        }
    }
}