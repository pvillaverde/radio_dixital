// deno-lint-ignore-file no-explicit-any
import { ResultSetHeader } from "npm:mysql2/promise";
import logger from "../../services/logger.service.ts";
import { TwitchStreamData } from "../../types/twitchApi.ts";
import connection from "../index.ts";
import ITwitchStream from "../models/twitchStream.model.ts";

interface ITwitchStreamStreamRepository {
   save(stream: TwitchStreamData): Promise<ITwitchStream>;
   update(stream: TwitchStreamData | ITwitchStream): Promise<ITwitchStream>;
   saveViews(stream: ITwitchStream): Promise<void>;
   retrieveAll(searchParams: { live: boolean }): Promise<ITwitchStream[]>;
   retrieveById(id: string): Promise<ITwitchStream | undefined>;
}

class TwitchStreamRepository implements ITwitchStreamStreamRepository {
   save(stream: TwitchStreamData): Promise<ITwitchStream> {
      return new Promise((resolve, reject) => {
         connection.query(
            `INSERT INTO twitch_streams 
            (id, type, user_id, user_login, user_name, game_id, game_name, title, viewer_count, started_at, ended_at, thumbnail_url, language, tags, is_mature)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [stream.id, stream.type, stream.user_id, stream.user_login, stream.user_name, stream.game_id, stream.game_name, stream.title, stream.viewer_count, new Date(stream.started_at), new Date(),
            stream.thumbnail_url, stream.language, stream.tags ? stream.tags.join(', ') : null, stream.is_mature],
            (err: any, _res: ITwitchStream | PromiseLike<ITwitchStream>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(stream)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(stream.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   update(stream: TwitchStreamData | ITwitchStream): Promise<ITwitchStream> {
      return new Promise((resolve, reject) => {
         this.retrieveById(stream.id).then(oldStream => {
            connection.query(
               `UPDATE twitch_streams SET
               type=?, user_id=?, user_login=?, user_name=?, game_id=?, game_name=?, title=?, viewer_count=?, started_at=?, ended_at=?, thumbnail_url=?, language=?, tags=?, is_mature=?
               WHERE id=?`,
               [stream.type, stream.user_id, stream.user_login, stream.user_name,
               // Prevent null values when changed stream type or no longer active
               stream.game_id && stream.game_id.length > 0 ? stream.game_id : oldStream.game_id,
               stream.game_name && stream.game_name.length > 0 ? stream.game_name : oldStream.game_name,
               // --
               stream.title, stream.viewer_count, new Date(stream.started_at), new Date(),
               stream.thumbnail_url, stream.language, stream.tags && Array.isArray(stream.tags) ? stream.tags.join(', ') : stream.tags, stream.is_mature, stream.id],
               (err: any, _res: ITwitchStream | PromiseLike<ITwitchStream>) => {
                  if (err) {
                     reject(err);
                  } else {
                     this.retrieveById(stream.id)
                        .then((b) => resolve(b))
                        .catch(reject);
                  }
               },
            );
         });
      });
   }
   saveViews(stream: ITwitchStream): Promise<void> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO twitch_streams_views (view_count,twitchstream_id) VALUES(?,?)",
            [stream.viewer_count, stream.id],
            (err: any, _res: ResultSetHeader | PromiseLike<ResultSetHeader>) => {
               if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  resolve();
               }
            },
         );
      });
   }
   retrieveAll(searchParams: { live?: boolean }): Promise<ITwitchStream[]> {
      let query: string = "SELECT * FROM twitch_streams";
      let condition: string = "";

      if (searchParams?.live) {
         condition += "type = 'live'";
      }

      if (condition.length) {
         query += " WHERE " + condition;
      }

      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: ITwitchStream[] | PromiseLike<ITwitchStream[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: string): Promise<ITwitchStream> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM twitch_streams WHERE id = ?",
            [id],
            (err: any, res: ITwitchStream[] | PromiseLike<ITwitchStream>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
}

export default new TwitchStreamRepository();
