import {Pool} from "../Database/pool.js";
import Razorpay from "razorpay";
import {validatePaymentVerification} from "razorpay/dist/utils/razorpay-utils.js";

export class PaymentController {
    async createDepositOrder(req,res){
        const {user} = req;
        const {order_id,amount} = req.body;
        if(!order_id || !amount){
            res.status(400).send("Send order_id and amount");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            const [rows,fields] = await connection.query(
                `insert into transactions(user_id,type,status,amount,order_id)`+
                `values(?,?,?,?,?)`,
                [user.id,"deposit","pending",amount,order_id]
            );
            res.status(200).send(JSON.stringify({
                "txn_id":rows["insertId"],
                "message":"Created Order"
            }));
        }catch (e){
            res.status(400).send(e.toString());
        }finally {
            connection.release();
        }
    }

    async confirmDepositOrder(req,res){
        const {user} = req;
        const {signature,payment_id,order_id,txn_id} = req.body;
        if(!signature || !payment_id || !txn_id){
            res.status(400).send("Signature,payment_id,txn_id required");
            return;
        }
        const signatureVerified = await this.verifySignature(order_id,payment_id,signature);
        if(!signatureVerified){
            res.status(400).send("Invalid transaction");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select balance from users where id=? for update`,
                [user.id]
            );
            const oldBalance = rows[0]["balance"];
            [rows,fields] = await connection.query(
                `select amount from transactions where id=? for update`,
                [txn_id]
            );
            const amount = rows[0]["amount"];
            await connection.query(
                `update transactions set status=?,payment_id_or_upi_id=?,signature=? where id=?`,
                ["completed",payment_id,signature,txn_id]
            );
            await connection.query(
                `update users set balance=? where id=?`,
                [oldBalance+amount,user.id]
            );
            await connection.commit();
            res.status(200).send(JSON.stringify({"message":"Money deposited"}));
        }catch (e){
            res.status(400).send(e);
        }finally {
            connection.release();
        }
    }

    async verifySignature(order_id,payment_id,signature){
        return await validatePaymentVerification({"order_id": order_id, "payment_id": payment_id }, signature,
            process.env.RAZORPAY_SECRET);
    }

    async createWithdrawRequest(req,res){
        const {user} = req;
        const {amount,upi_id} = req.body;
        if(!amount || !upi_id){
            res.status(400).send("Send amount and upi_id");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            let [rows,fields] = await connection.query(
                `insert into transactions(user_id,type,status,amount,payment_id_or_upi_id)`+
                ` values(?,?,?,?,?)`,
                [user.id,"withdrawal","pending",amount,upi_id]
            );
            res.status(200).send(JSON.stringify({"message":"Request Created"}));
        }catch (e){
            res.status(400).send(e.toString());
        }finally {
            connection.release();
        }
    }

    async updateWithdrawRequest(req,res) {
        const {user} = req;
        const {txn_id} = req.body;
        if (!txn_id) {
            res.status(400).send("txn_id required");
            return;
        }
        let connection = await Pool.getConnection();
        try{
            await connection.beginTransaction();
            let [rows,fields] = await connection.query(
                `select amount,user_id from transactions where id=?`,
                [txn_id]
            );
            const amount = rows[0]["amount"];
            const userId = rows[0]["user_id"];
            [rows,fields] = await connection.query(
                `select balance from users where id=? for update`,
                [userId]
            );
            const currentBalance = rows[0]["balance"];
            if(currentBalance<amount){
                res.status(400).send(JSON.stringify({"message":"Not enough balance in users wallet"}));
                return;
            }
            await connection.query(
                `update users set balance=? where id=?`,
                [currentBalance-amount,userId]
            );
            await connection.commit();
            res.status(200).send(JSON.stringify({"message":"Approved"}));
        }catch (e){
            res.status(400).send(e.toString());
        }finally {
            connection.release();
        }
    }
}