import mysql from "npm:mysql2";
import dbConfig from "../config/db.config.ts";

export default mysql.createConnection({
   host: dbConfig.DB_HOST,
   user: dbConfig.DB_USER,
   password: dbConfig.DB_PASS,
   database: dbConfig.DB_NAME,
});
