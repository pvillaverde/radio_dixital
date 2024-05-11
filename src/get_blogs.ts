import blogRepository from "./database/repositories/blog.repository.ts";
import entryRepository from "./database/repositories/entry.repository.ts";
import logger from "./services/logger.service.ts";
import { fetchJsonData, getFeedData } from "./services/utils.service.ts";
import { BlogData } from "./types/api.ts";
import connection from "./database/index.ts";
const API_URL = "https://obradoirodixitalgalego.gal/api/blogomillo.json"

const blogs: BlogData[] = await fetchJsonData(API_URL);
logger.info(`Recuperados ${blogs.length} blogs dende a API.`);
for (const [index, item] of blogs.entries()) {
   try {
      // Gardamos (ou actualizamos) o blogue na base de datos
      blogRepository.save(item);
      // Obtemos a información do RSS
      const feedData = await getFeedData(item.rss, "rss");
      // deno-lint-ignore no-explicit-any
      const entries = feedData.item.map((i: any) => {
         return {
            type: "blog",
            date: new Date(i.pubDate),
            title: i.title,
            link: i.link,
            blog_id: item.id
         }
      })
      for (const entry of entries) {
         try {
            const databaseEntry = await entryRepository.retrieveByLink(entry.link);
            // logger.debug(`Entrada xa publicada: ${databaseEntry.title}: ${databaseEntry.link}`)
            if (!databaseEntry) throw undefined;
         } catch (_error) {
            logger.info(`Nova entrada de ${item.title}: ${entry.title} - ${entry.link}`);
            logger.debug(entry);
            await entryRepository.save(entry);
         }
      }
      logger.info(`${index + 1}/${blogs.length}`, `Refreshed ${entries.length} entries from ${item.title}.`);
   } catch (error) {
      logger.fatal(`Erro ao actualizar o blogue ${item.title}`);
      logger.fatal(error);
   }
}
logger.info(`Finished refreshing ${blogs.length} blogs.`);
connection.end();