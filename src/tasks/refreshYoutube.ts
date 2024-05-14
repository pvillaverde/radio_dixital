import mqttConfig from "../config/mqtt.config.ts";
import entryRepository from "../database/repositories/entry.repository.ts";
import youtubeRepository from "../database/repositories/youtube.repository.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import { fetchJsonData, getFeedData } from "../services/utils.service.ts";
import { YoutubeData } from "../types/api.ts";
import PubSubMessage from "../types/pubsub.message.ts";

export default async function refreshYoutube() {
   const API_URL = "https://obradoirodixitalgalego.gal/api/youtube.json";
   const youtubeChannels: YoutubeData[] = await fetchJsonData(API_URL);
   logger.info(`Refrescando ${youtubeChannels.length} canles de YouTube dende a API.`);
   for (const [index, item] of youtubeChannels.entries()) {
      try {
         // Gardamos (ou actualizamos) o blogue na base de datos
         youtubeRepository.save(item);
         // Obtemos a información do RSS
         const feedData = await getFeedData(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${item.uuid}`,
            "youtube",
         );
         // deno-lint-ignore no-explicit-any
         let entries: any[] = [];
         if (Array.isArray(feedData.entry)) {
            // deno-lint-ignore no-explicit-any
            entries = feedData.entry.map((i: any) => {
               return {
                  type: "youtube",
                  date: new Date(i.published),
                  title: i.title,
                  link: i.link["@href"] || `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
                  youtube_id: item.id,
               };
            });
         } else if (feedData.entry) {
            entries = [{
               type: "youtube",
               date: new Date(feedData.entry.published),
               title: feedData.entry.title,
               link: feedData.entry.link["@href"] ||
                  `https://obradoirodixitalgalego.gal/comunidade/proxectos/${item.id}/`,
               youtube_id: item.id,
            }];
         }
         for (const entry of entries) {
            try {
               const databaseEntry = await entryRepository.retrieveByLink(entry.link);
               logger.debug(`Vídeo xa publicado: ${databaseEntry.title}: ${databaseEntry.link}`);
               if (!databaseEntry) throw undefined;
            } catch (_error) {
               logger.info(`Novo vídeo de ${item.title}: ${entry.title} - ${entry.link}`);
               logger.debug(entry);
               await entryRepository.save(entry);
               mqttService.connect();
               mqttService.on("connect", () => {
                  const message: PubSubMessage = {
                     type: "youtube",
                     title: item.title,
                     mastodon: item.mastodon,
                     twitter: item.twitter,
                     entryTitle: entry.title,
                     entryLink: entry.link,
                  }
                  logger.debug(`Publishing to MQTT topic "${mqttConfig.MQTT_TOPIC}"`, JSON.stringify(message));
                  mqttService.publish(mqttConfig.MQTT_TOPIC, JSON.stringify(message));
               })
            }
         }
         logger.info(
            `${index + 1}/${youtubeChannels.length}`,
            `Recuperados ${entries.length} vídeos de ${item.title}.`,
         );
         // Rate Limit 1/sec
         await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
         logger.error(`Erro ao actualizar o blogue ${item.title}`);
         logger.error(error);
      }
   }
   logger.info(`Finalizado o refresco de ${youtubeChannels.length} canles de YouTube.`);
}
