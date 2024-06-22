import {Pool} from "../Database/pool.js";

export class StatusController{

    async openGames(req,res) {
        let connection = await Pool.getConnection();
        const [rows, fields] = await connection.query(
            `select * from games where status=?`,
            ['open']);
        connection.release();
        res.status(200).send(rows);
    }

    async liveGames(req,res) {
        const {offset} = req.query;
        let connection = await Pool.getConnection();
        let [rows,fields] = [];
        if(!offset) {
            [rows, fields] = await connection.query(
                `select * from games where status=? limit 10`,
                ['playing']);
        }else{
            [rows,fields] = await connection.query(
                `select * from games where status=? and id between ? and ?`,
                ['playing',offset+1,offset+10]
            );
        }
        connection.release();
        res.status(200).send(rows);
    }

    getRank() {
        return undefined;
    }

    leaderboard() {
        return undefined;
    }
}