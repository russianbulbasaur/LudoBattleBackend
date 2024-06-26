import {Pool} from "../Database/pool.js";
import multer from "multer";

export class GameController{

    async createGame(req,res) {
        const {user} = req;
        const {amount} = req.body;
        if(!amount){
            res.status(400).send("Amount is required");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await
                connection.query(`select balance from users where id=? for update`,
                    [user.id]);
            const userBalance = rows[0]["balance"];
            if(userBalance<amount){
                await connection.commit();
                res.status(404).send(JSON.stringify({"message":"Not enough balance"}));
                return;
            }
            [rows,fields] = await connection.query(
                `select count(*) as games from games where host_id=? and (status=? or status=? or status=?)`,
                [user.id,"open","playing","waiting"]);
            const gameCount = rows[0]["games"];
            if(gameCount>0){
                res.status(400).send(JSON.stringify({"message":"A game already exists"}));
                return;
            }
            await connection.query(`update users set balance=? where id=?`,
                [userBalance-amount,user.id]);
            [rows,fields] =
                await connection.query(`insert into `+
                    `games(host_id,amount,winning_amount,status)`+
                    `values(?,?,?,?)`,[user.id,amount,amount,"open"]);
            await connection.commit();
            res.status(200).send(JSON.stringify({"message":"Game created",
            "game_id":rows["insertId"]}));
        }catch (e) {
            await connection.rollback();
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }

    async deleteGame(req,res) {
        const {user} = req;
        const {game_id} = req.body;
        if(!game_id){
            res.status(400).send("Send game id");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select * from games where id=? for update`,[game_id]
            );
            const amount = rows[0]["amount"];
            if(rows[0]["host_id"]!==user.id){
                res.status(400).send(`{"message":"User does not own the game"}`);
                return;
            }
            if(rows[0]["status"]!=="open") {
                res.status(400).send("The game is not open");
                return;
            }
            [rows,fields] = await connection.query(
                `select balance from users where id=? for update`,
                [user.id]
            );
            const currBalance = rows[0]["balance"];
            await connection.query(`delete from games where id=?`,[game_id]);
            await connection.query(
                `update users set balance=? where id=?`,
                [currBalance+amount,user.id]
            );
            await connection.commit();
            res.status(200).send("Game deleted");
        }catch (e){
            await connection.rollback();
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }


    async acceptGame(req,res) {
        const {user} = req;
        const {game_id} = req.body;
        if(!game_id){
            res.status(400).send("Game id is required");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select * from games where id=? for update`,[game_id]
            );
            const gameAmount = rows[0]["amount"];
            if(rows[0]["status"]!=="open"){
                res.status(400).send("Game not open");
                return;
            }
            [rows,fields] = await connection.query(
                `select balance from users where id=? for update`,[user.id]
            );
            const userBalance = rows[0]["balance"]
            if(userBalance<gameAmount){
                res.status(400).send("Not enough balance");
                return;
            }
            await connection.query(
                `update users set balance=? where id=?`,
                [userBalance-gameAmount,user.id]);
            await connection.query(
                `update games set status=?,player_id=? where id=?`,
                ["waiting",user.id,game_id]
            );
            await connection.commit();
            res.status(200).send("Accepted game");
        }catch(e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }


    async sendGameCode(req,res){
        const {game_id,code} = req.body;
        if(!game_id || !code){
            res.status(400).send("Game id,code is required");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.query(
                `update games set code=?,status=? where id=?`,
                [code,"playing",game_id]
            );
            res.status(200).send("Code updated");
        }catch(e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }

    async getGameStatus(req,res){
        const {user} = req;
        const {gameId} = req.query;
        if(!gameId){
            res.status(400).send(JSON.stringify({"message":"Send game id"}));
            return;
        }
        const connection = await Pool.getConnection();
        try{
            const [rows,fields] = await connection.query(
                `select games.*,u1.name as hostName,u2.name as playerName from games `+
                `inner join users u1 on games.host_id=u1.id `+
                `left join users u2 on games.player_id=u2.id `+
                `where games.id=?`,
                [gameId]
            );
            res.status(200).send(JSON.stringify(rows[0]));
        }catch (e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }


    async submitResults(req,res) {
        const {user} = req;
        const {result,game_id} = req.body;
        const uploadedFilename = req.file.filename;
        if(!result || !game_id || !uploadedFilename){
            res.status(400).send("Result,gameid,upload required");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select host_id,player_id,attachments,winner from games where id=? for update`,
                [game_id]
            );
            if(rows[0]["host_id"]!==user.id && rows[0]["player_id"]!==user.id){
                res.status(400).send("This user is not a host or a player");
                return;
            }
            let winner = rows[0]["winner"];
            if(result==="win") {
                if (winner && winner !== user.id) {
                    res.status(400).send("same");
                    return;
                }
                winner = user.id;
            }
            const attachments = rows[0]["attachments"];
            attachments[user.id] = uploadedFilename;
            await connection.query(
                `update games set attachments=?,status=?,winner=? where id=?`,
                [attachments,"ended",winner,game_id]
            );
            await connection.commit();
        }catch (e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }
}