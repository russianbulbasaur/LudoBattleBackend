import 'mysql'
import 'dotenv/config'
import mysql from "mysql2";

export class Pool {
    init(){
        const pool = mysql.createPool({
            connectionLimit: 5,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        pool.getConnection((err,connection)=> {
            if(err)
                throw err;
            console.log('Database connected successfully');
            connection.release();
        });
        this.pool = pool;
    }

}


