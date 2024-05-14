import blogRepository from "../database/repositories/blog.repository.ts";
import entryRepository from "../database/repositories/entry.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchJsonData, getFeedData } from "../services/utils.service.ts";
import { BlogData } from "../types/api.ts";

export default async function refreshBlogs() {
   const API_URL = "https://obradoirodixitalgalego.gal/api/blogomillo.json"
   const blogs: BlogData[] = await fetchJsonData(API_URL);
   logger.info(`Refrescando ${blogs.length} blogues dende a API.`);
   for (const [index, item] of blogs.entries()) {
      try {
         // Gardamos (ou actualizamos) o blogue na base de datos
         blogRepository.save(item);
         // Obtemos a información do RSS
         const feedData = await getFeedData(item.rss, "rss");
         // deno-lint-ignore no-explicit-any
         let entries: any[] = [];
         if (Array.isArray(feedData.entry)) {
            entries = feedData.entry.map((i: any) => {
               return {
                  type: "blog",
                  date: new Date(i.pubDate),
                  title: i.title,
                  link: i.link || `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
                  blog_id: item.id
               }
            })
         } else if (feedData.entry) {
            entries = [{
               type: "blog",
               date: new Date(feedData.entry.pubDate),
               title: feedData.entry.title,
               link: feedData.entry.link || `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
               blog_id: item.id
            }]
         }
         for (const entry of entries) {
            try {
               const databaseEntry = await entryRepository.retrieveByLink(entry.link);
               logger.debug(`Entrada xa publicada: ${databaseEntry.title}: ${databaseEntry.link}`)
               if (!databaseEntry) throw undefined;
            } catch (_error) {
               logger.info(`Nova entrada de ${item.title}: ${entry.title} - ${entry.link}`);
               logger.debug(entry);
               await entryRepository.save(entry);
            }
         }
         logger.info(`${index + 1}/${blogs.length}`, `Recuperadas ${entries.length} entradas de ${item.title}.`);
      } catch (error) {
         logger.fatal(`Erro ao actualizar o blogue ${item.title}`);
         logger.fatal(error);
      }
   }
   logger.info(`Finalizado o refresco de ${blogs.length} blogues.`);
}