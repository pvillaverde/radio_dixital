import mysql from "npm:mysql2";
import dbConfig from "../config/db.config.ts";
import logger from "../services/logger.service.ts";

const connection = mysql.createConnection({
   host: dbConfig.DB_HOST,
   user: dbConfig.DB_USER,
   password: dbConfig.DB_PASS,
   database: dbConfig.DB_NAME,
});
connection.connect(err => {
   if (err) {
      logger.fatal(err)
      Deno.exit(1);
   }
})
export default connection