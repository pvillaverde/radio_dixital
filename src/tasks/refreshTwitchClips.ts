import twitchRepository from "../database/repositories/twitch.repository.ts";
import twitchClipRepository from "../database/repositories/twitchClip.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchClips } from "../services/twitch.service.ts";

export default async function refreshTwitchClips() {
   const twitchChannels = await twitchRepository.retrieveAll({ enabled: true });
   logger.info(`Refrescando os clips de ${twitchChannels.length} canles de Twitch dende a API.`);
   // Recuperar os datos dos usuarios dende a API de Twitch
   let totalClips = 0;
   for (const [index, item] of twitchChannels.entries()) {
      const clips = await fetchClips(item.id);
      for (const clip of clips) {
         logger.debug(clip);
         await twitchClipRepository.save(clip);
      }
      totalClips += clips.length;
      logger.info(`${index + 1}/${twitchChannels.length}`, `Recuperados ${clips.length} clips de ${item.display_name}.`);
   }
   logger.info(`Finalizado o refresco de ${totalClips} clips de ${twitchChannels.length} canles de Twitch.`);
}