// deno-lint-ignore-file no-explicit-any
import logger from "../../services/logger.service.ts";
import { BlogData } from "../../types/api.ts";
import connection from "../index.ts";
import IBlog from "../models/blog.model.ts";


interface IBlogRepository {
   save(blog: BlogData): Promise<IBlog>;
   update(blog: BlogData): Promise<IBlog>;
   retrieveAll(searchParams: { title: string, published: boolean }): Promise<IBlog[]>;
   retrieveById(id: string): Promise<IBlog | undefined>;
   // update(blog: Blog): Promise<number>;
   // delete(blogId: number): Promise<number>;
   // deleteAll(): Promise<number>;
}

class BlogRepository implements IBlogRepository {
   save(blog: BlogData): Promise<IBlog> {
      return new Promise((resolve, reject) => {
         connection.query(
            "INSERT INTO blog (id ,rss, title, published) VALUES(?,?,?,?)",
            [blog.id, blog.rss, blog.title, new Date()],
            (err: any, _res: IBlog | PromiseLike<IBlog>) => {
               if (err && err.code == "ER_DUP_ENTRY") {
                  this.update(blog)
                     .then((b) => resolve(b))
                     .catch(reject);
               } else if (err) {
                  logger.error(err);
                  reject(err);
               } else {
                  this.retrieveById(blog.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            }
         );
      });
   }
   update(blog: BlogData): Promise<IBlog> {
      return new Promise((resolve, reject) => {
         connection.query(
            "UPDATE blog SET rss=?, title=? WHERE id=?",
            [blog.rss, blog.title, blog.id],
            (err: any, _res: IBlog | PromiseLike<IBlog>) => {
               if (err) {
                  reject(err);
               } else {
                  this.retrieveById(blog.id)
                     .then((b) => resolve(b))
                     .catch(reject);
               }
            }
         );
      });
   }
   retrieveAll(searchParams: { title?: string, published?: boolean }): Promise<IBlog[]> {
      let query: string = "SELECT * FROM blog";
      let condition: string = "";

      if (searchParams?.published)
         condition += "published = TRUE"

      if (searchParams?.title)
         condition += `LOWER(title) LIKE '%${searchParams.title}%'`

      if (condition.length)
         query += " WHERE " + condition;

      return new Promise((resolve, reject) => {
         connection.query(query, (err: any, res: IBlog[] | PromiseLike<IBlog[]>) => {
            if (err) reject(err);
            else resolve(res);
         });
      });
   }

   retrieveById(id: string): Promise<IBlog> {
      return new Promise((resolve, reject) => {
         connection.query(
            "SELECT * FROM blog WHERE id = ?",
            [id],
            (err: any, res: IBlog[] | PromiseLike<IBlog>[]) => {
               if (err) reject(err)
               else resolve(res[0])
            }
         )
      })
   }

   // update(tutorial: Tutorial): Promise<number> { }

   // delete(tutorialId: number): Promise<number> { }

   // deleteAll(): Promise<number> { }
}

export default new BlogRepository();