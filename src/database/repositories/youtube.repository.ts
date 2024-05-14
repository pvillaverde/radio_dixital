// deno-lint-ignore-file no-explicit-any
import logger from "../../services/logger.service.ts";
import { YoutubeData } from "../../types/api.ts";
import connection from "../index.ts";
import IYoutube from "../models/youtube.model.ts";

interface IYoutubeRepository {
   save(youtube: YoutubeData): Promise<IYoutube>;
   update(youtube: YoutubeData): Promise<IYoutube>;
   retrieveAll(searchParams: { title: string; published: boolean }): Promise<IYoutube[]>;
   retrieveById(id: string): Promise<IYoutube | undefined>;
}

class YoutubeRepository implements IYoutubeRepository {
   save(youtube: YoutubeData): Promise<IYoutube> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO youtube (id ,uuid, title, published) VALUES(?,?,?,?)",
            [youtube.id, youtube.uuid, youtube.title, new Date()],
            (err: any, _res: IYoutube | PromiseLike<IYoutube>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(youtube)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(youtube.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   update(youtube: YoutubeData): Promise<IYoutube> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE youtube SET uuid=?, title=? WHERE id=?",
            [youtube.uuid, youtube.title, youtube.id],
            (err: any, _res: IYoutube | PromiseLike<IYoutube>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(youtube.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   retrieveAll(searchParams: { title?: string; published?: boolean }): Promise<IYoutube[]> {
      let query: string = "SELECT * FROM youtube";
      let condition: string = "";

      if (searchParams?.published) {
         condition += "published = TRUE";
      }

      if (searchParams?.title) {
         condition += `LOWER(title) LIKE '%${searchParams.title}%'`;
      }

      if (condition.length) {
         query += " WHERE " + condition;
      }

      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: IYoutube[] | PromiseLike<IYoutube[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: string): Promise<IYoutube> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM youtube WHERE id = ?",
            [id],
            (err: any, res: IYoutube[] | PromiseLike<IYoutube>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
}

export default new YoutubeRepository();
