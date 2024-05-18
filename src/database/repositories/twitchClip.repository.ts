// deno-lint-ignore-file no-explicit-any
import logger from "../../services/logger.service.ts";
import { TwitchClipData } from "../../types/twitchApi.ts";
import connection from "../index.ts";
import ITwitchClip from "../models/twitchClip.model.ts";

interface ITwitchClipClipRepository {
   save(clip: TwitchClipData): Promise<ITwitchClip>;
   update(clip: TwitchClipData): Promise<ITwitchClip>;
   retrieveById(id: string): Promise<ITwitchClip | undefined>;
}

class TwitchClipRepository implements ITwitchClipClipRepository {
   save(clip: TwitchClipData): Promise<ITwitchClip> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO twitch_clips (id, url, embed_url, broadcaster_id, broadcaster_name, creator_id, creator_name, game_id, language, title, view_count, clip_created_at, thumbnail_url) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [clip.id, clip.url, clip.embed_url, clip.broadcaster_id, clip.broadcaster_name, clip.creator_id, clip.creator_name, clip.game_id, clip.language, clip.title, clip.view_count, new Date(clip.created_at), clip.thumbnail_url],
            (err: any, _res: ITwitchClip | PromiseLike<ITwitchClip>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(clip)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(clip.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   update(clip: TwitchClipData): Promise<ITwitchClip> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE twitch_clips SET url=?, embed_url=?, broadcaster_id=?, broadcaster_name=?, creator_id=?, creator_name=?, game_id=?, language=?, title=?, view_count=?, clip_created_at=?, thumbnail_url=? WHERE id=?",
            [clip.url, clip.embed_url, clip.broadcaster_id, clip.broadcaster_name, clip.creator_id, clip.creator_name, clip.game_id, clip.language, clip.title, clip.view_count, new Date(clip.created_at), clip.thumbnail_url, clip.id],
            (err: any, _res: ITwitchClip | PromiseLike<ITwitchClip>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(clip.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   retrieveById(id: string): Promise<ITwitchClip> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM twitch_clips WHERE id = ?",
            [id],
            (err: any, res: ITwitchClip[] | PromiseLike<ITwitchClip>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
}

export default new TwitchClipRepository();
