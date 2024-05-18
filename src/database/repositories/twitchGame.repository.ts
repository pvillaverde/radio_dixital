// deno-lint-ignore-file no-explicit-any
import { ResultSetHeader, RowDataPacket } from "npm:mysql2/promise";
import logger from "../../services/logger.service.ts";
import { TwitchGameData } from "../../types/twitchApi.ts";
import connection from "../index.ts";
import ITwitch from "../models/twitch.model.ts";
import ITwitchGame from "../models/twitchGame.model.ts";

interface ITwitchGameRepository {
   save(game: TwitchGameData): Promise<ITwitchGame>;
   update(game: TwitchGameData): Promise<ITwitchGame>;
   retrieveById(id: string): Promise<ITwitchGame | undefined>;
}

class TwitchGameRepository implements ITwitchGameRepository {
   save(game: TwitchGameData): Promise<ITwitchGame> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO twitch_games (id, name, box_art_url) VALUES(?,?,?)",
            [game.id, game.name, game.box_art_url],
            (err: any, _res: ITwitchGame | PromiseLike<ITwitchGame>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(game)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(game.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   update(game: TwitchGameData): Promise<ITwitchGame> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE twitch_games SET name=?, box_art_url=? WHERE id=?",
            [game.name, game.box_art_url, game.id],
            (err: any, _res: ITwitchGame | PromiseLike<ITwitchGame>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(game.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            },
         );
      });
   }
   retrieveById(id: string): Promise<ITwitchGame> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM twitch_games WHERE id = ?",
            [id],
            (err: any, res: ITwitchGame[] | PromiseLike<ITwitchGame>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
   getMissingGameIds(): Promise<string[]> {
      return new Promise((resolve, reject) => {
         connection.query(
            `SELECT DISTINCT tc.game_id as id FROM twitch_clips tc LEFT JOIN twitch_games tg ON tg.id=tc.game_id WHERE tg.id IS NULL AND tc.game_id !=''
            UNION 
            SELECT DISTINCT ts.game_id as id FROM twitch_streams ts LEFT JOIN twitch_games tg ON tg.id=ts.game_id WHERE tg.id IS NULL AND ts.game_id !=''`,
            (err: any, res: ITwitchGame[]) => {
               if (err) reject(err);
               else resolve(res.map(i => i.id));
            },
         );
      });
   }
}

export default new TwitchGameRepository();

