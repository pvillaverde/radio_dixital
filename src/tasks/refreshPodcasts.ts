import podcastRepository from "../database/repositories/podcast.repository.ts";
import entryRepository from "../database/repositories/entry.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchJsonData, getFeedData } from "../services/utils.service.ts";
import { PodcastData } from "../types/api.ts";

export default async function refreshPodcasts() {
   const API_URL = "https://obradoirodixitalgalego.gal/api/podcast.json"
   const podcasts: PodcastData[] = await fetchJsonData(API_URL);
   logger.info(`Refrescando ${podcasts.length} podcasts dende a API.`);
   for (const [index, item] of podcasts.entries()) {
      try {
         // Gardamos (ou actualizamos) o blogue na base de datos
         podcastRepository.save(item);
         // Obtemos a información do RSS
         const feedData = await getFeedData(item.rss, "rss");
         // deno-lint-ignore no-explicit-any
         let entries: any[] = [];
         if (Array.isArray(feedData.entry)) {
            entries = feedData.entry.map((i: any) => {
               return {
                  type: "podcast",
                  date: new Date(i.pubDate),
                  title: i.title,
                  link: i.link || `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
                  podcast_id: item.id
               }
            })
         } else if (feedData.entry) {
            entries = [{
               type: "podcast",
               date: new Date(feedData.entry.pubDate),
               title: feedData.entry.title,
               link: feedData.entry.link || `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
               podcast_id: item.id
            }]
         }
         for (const entry of entries) {
            try {
               const databaseEntry = await entryRepository.retrieveByLink(entry.link);
               logger.debug(`Episodio xa publicado: ${databaseEntry.title}: ${databaseEntry.link}`)
               if (!databaseEntry) throw undefined;
            } catch (_error) {
               logger.info(`Novo episodio de ${item.title}: ${entry.title} - ${entry.link}`);
               logger.debug(entry);
               await entryRepository.save(entry);
            }
         }
         logger.info(`${index + 1}/${podcasts.length}`, `Recuperados ${entries.length} episodios de ${item.title}.`);
      } catch (error) {
         logger.fatal(`Erro ao actualizar o blogue ${item.title}`);
         logger.fatal(error);
      }
   }
   logger.info(`Finalizado o refresco de ${podcasts.length} podcasts.`);
}