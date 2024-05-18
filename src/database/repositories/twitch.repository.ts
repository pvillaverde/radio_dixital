// deno-lint-ignore-file no-explicit-any
import { ResultSetHeader } from "npm:mysql2/promise";
import logger from "../../services/logger.service.ts";
import { TwitchUserData } from "../../types/twitchApi.ts";
import connection from "../index.ts";
import ITwitch from "../models/twitch.model.ts";

interface ITwitchRepository {
   save(channel: TwitchUserData): Promise<ITwitch>;
   update(channel: TwitchUserData): Promise<ITwitch>;
   saveFollowers(channel: ITwitch, followers: number): Promise<void>;
   disableAll(): Promise<void>;
   retrieveAll(searchParams: { enabled: boolean }): Promise<ITwitch[]>;
   retrieveById(id: string): Promise<ITwitch | undefined>;
}

class TwitchRepository implements ITwitchRepository {
   save(channel: TwitchUserData): Promise<ITwitch> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO twitch_channels (id, login, display_name, type, broadcaster_type, description, profile_image_url, offline_image_url, channel_created_at, twitter, mastodon, enabled) VALUES(?,?,?,?,?,?,?,?,?,?,?, true)",
            [channel.id, channel.login, channel.display_name, channel.type, channel.broadcaster_type, channel.description, channel.profile_image_url, channel.offline_image_url, new Date(channel.created_at), channel.twitter, channel.mastodon],
            (err: any, _res: ITwitch | PromiseLike<ITwitch>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(channel)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(channel.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   update(channel: TwitchUserData): Promise<ITwitch> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE twitch_channels SET enabled=true, login=?, display_name=?, type=?, broadcaster_type=?, description=?, profile_image_url=?, offline_image_url=?, channel_created_at=?, twitter=?, mastodon=? WHERE id=?",
            [channel.login, channel.display_name, channel.type, channel.broadcaster_type, channel.description, channel.profile_image_url, channel.offline_image_url, new Date(channel.created_at), channel.twitter, channel.mastodon, channel.id],
            (err: any, _res: ITwitch | PromiseLike<ITwitch>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(channel.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   saveFollowers(channel: ITwitch, followers: number): Promise<void> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO twitch_channels_stats (follow_count,twitchchannel_id) VALUES(?,?)",
            [followers, channel.id],
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
   disableAll(): Promise<void> {
      let query: string = "UPDATE twitch_channels SET enabled = FALSE;";
      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: ResultSetHeader[] | PromiseLike<ResultSetHeader[]>) => {
            if (err) reject(err);
            else resolve();
         });
      });
   }
   retrieveAll(searchParams: { enabled?: boolean }): Promise<ITwitch[]> {
      let query: string = "SELECT * FROM twitch_channels";
      let condition: string = "";

      if (searchParams?.enabled) {
         condition += "enabled = TRUE";
      }

      if (condition.length) {
         query += " WHERE " + condition;
      }

      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: ITwitch[] | PromiseLike<ITwitch[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: string): Promise<ITwitch> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM twitch_channels WHERE id = ?",
            [id],
            (err: any, res: ITwitch[] | PromiseLike<ITwitch>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
}

export default new TwitchRepository();
