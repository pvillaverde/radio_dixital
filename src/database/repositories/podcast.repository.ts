// deno-lint-ignore-file no-explicit-any
import logger from "../../services/logger.service.ts";
import { PodcastData } from "../../types/api.ts";
import connection from "../index.ts";
import IPodcast from "../models/podcast.model.ts";


interface IPodcastRepository {
   save(podcast: PodcastData): Promise<IPodcast>;
   update(podcast: PodcastData): Promise<IPodcast>;
   retrieveAll(searchParams: { title: string, published: boolean }): Promise<IPodcast[]>;
   retrieveById(id: string): Promise<IPodcast | undefined>;
}

class PodcastRepository implements IPodcastRepository {
   save(podcast: PodcastData): Promise<IPodcast> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO podcast (id ,rss, title, published) VALUES(?,?,?,?)",
            [podcast.id, podcast.rss, podcast.title, new Date()],
            (err: any, _res: IPodcast | PromiseLike<IPodcast>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(podcast)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(podcast.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            }
         );
      });
   }
   update(podcast: PodcastData): Promise<IPodcast> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE podcast SET rss=?, title=? WHERE id=?",
            [podcast.rss, podcast.title, podcast.id],
            (err: any, _res: IPodcast | PromiseLike<IPodcast>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(podcast.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            }
         );
      });
   }
   retrieveAll(searchParams: { title?: string, published?: boolean }): Promise<IPodcast[]> {
      let query: string = "SELECT * FROM podcast";
      let condition: string = "";

      if (searchParams?.published)
         condition += "published = TRUE"

      if (searchParams?.title)
         condition += `LOWER(title) LIKE '%${searchParams.title}%'`

      if (condition.length)
         query += " WHERE " + condition;

      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: IPodcast[] | PromiseLike<IPodcast[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: string): Promise<IPodcast> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM podcast WHERE id = ?",
            [id],
            (err: any, res: IPodcast[] | PromiseLike<IPodcast>[]) => {
               if (err) reject(err)
               else resolve(res[0])
            }
         )
      })
   }
}

export default new PodcastRepository();