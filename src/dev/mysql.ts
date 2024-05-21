import mysql from "npm:mysql2";
import dbConfig from "../config/db.config.ts";
import logger from "../services/logger.service.ts";

const connection = mysql.createConnection({
   host: dbConfig.DB_HOST,
   user: dbConfig.DB_USER,
   password: dbConfig.DB_PASS,
   database: dbConfig.DB_NAME,
   authPlugins: {
      caching_sha2_password: mysql.authPlugins.caching_sha2_password({
         onServerPublicKey: function (data) {
            console.log("onServerPublicKey", data);
            console.log("onServerPublicKey", data.toString());
         },
         overrideIsSecure: false //
      })
   },
   debug: false
});
connection.connect(err => {
   if (err) {
      logger.fatal(err)
      Deno.exit(1);
   } else {
      logger.info("Connected to the database!")
      Deno.exit(0)
   }
})
export default connection