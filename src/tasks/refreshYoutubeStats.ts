import googleConfig from "../config/google.config.ts";
import youtubeRepository from "../database/repositories/youtube.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchJsonData } from "../services/utils.service.ts";
import { YoutubeData } from "../types/api.ts";
import YoutubeStat from "../types/youtubeStats.ts";

export default async function refreshYoutubeStats() {
   const API_URL = "https://obradoirodixitalgalego.gal/api/youtube.json";
   const youtubeChannels: YoutubeData[] = await fetchJsonData(API_URL);
   logger.info(`Refrescando as estatíticas de ${youtubeChannels.length} canles de YouTube dende a API de YouTube.`);
   for (const [index, item] of youtubeChannels.entries()) {
      try {
         const youtubeJson = await fetchJsonData(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&key=${googleConfig.appKey}&id=${item.uuid}`)
         if (youtubeJson && youtubeJson.items && youtubeJson.items[0] && youtubeJson.items[0].statistics) {
            const youtubeChannelStats: YoutubeStat = {
               hidden_subscriber_count: youtubeJson.items[0].statistics.hiddenSubscriberCount,
               view_count: youtubeJson.items[0].statistics.viewCount,
               subscriber_count: youtubeJson.items[0].statistics.subscriberCount,
               video_count: youtubeJson.items[0].statistics.videoCount,
               channel_uuid: item.uuid,
               youtube_id: item.id
            };
            await youtubeRepository.saveStats(youtubeChannelStats);
            logger.debug(youtubeChannelStats)
         }
         logger.info(`${index + 1}/${youtubeChannels.length}`, `Actualizadas estatísticas de ${item.title}.`);
      } catch (error) {
         logger.error(`Erro ao actualizar o blogue ${item.title}`);
         logger.error(error);
      }
   }
   logger.info(`Gardadas as estatísticas de ${youtubeChannels.length} canles de YouTube.`);
   Deno.exit(0);
}