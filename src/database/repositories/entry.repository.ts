// deno-lint-ignore-file no-explicit-any
import EntryData from "../../types/entry.ts";
import connection from "../index.ts";
import IEntry from "../models/entry.model.ts";

interface IEntryRepository {
   save(blog: IEntry): Promise<IEntry>;
   retrieveAll(searchParams: { title: string; published: boolean }): Promise<IEntry[]>;
   retrieveById(id: number): Promise<IEntry | undefined>;
   retrieveByLink(link: string): Promise<IEntry | undefined>;
}

class EntryRepository implements IEntryRepository {
   save(entry: EntryData): Promise<IEntry> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO entry (type, date, title, link, youtube_id, podcast_id, blog_id) VALUES(?,?,?,?,?,?,?)",
            [entry.type, entry.date, entry.title, entry.link, entry.youtube_id, entry.podcast_id, entry.blog_id],
            (err: any, _res: IEntry | PromiseLike<IEntry>) => {
               if (err) reject(err);
               else {
                  this.retrieveByLink(entry.link)
                     .then((newEntry) => resolve(newEntry))
                     .catch(reject);
               }
            },
         );
      });
   }
   retrieveAll(searchParams: { title?: string; published?: boolean }): Promise<IEntry[]> {
      let query: string = "SELECT * FROM blog";
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
         connection.query(query, (err: any, res: IEntry[] | PromiseLike<IEntry[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: number): Promise<IEntry> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM entry WHERE id = ?",
            [id],
            (err: any, res: IEntry[] | PromiseLike<IEntry>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }

   retrieveByLink(link: string): Promise<IEntry> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM entry WHERE link = ?",
            [link],
            (err: any, res: IEntry[] | PromiseLike<IEntry>[]) => {
               if (err) reject(err);
               else resolve(res[0]);
            },
         );
      });
   }
}

export default new EntryRepository();
