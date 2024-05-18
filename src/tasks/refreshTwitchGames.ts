import twitchRepository from "../database/repositories/twitch.repository.ts";
import twitchClipRepository from "../database/repositories/twitchClip.repository.ts";
import twitchGameRepository from "../database/repositories/twitchGame.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchClips, fetchGames } from "../services/twitch.service.ts";

export default async function refreshTwitchGames() {
   const missingGames = await twitchGameRepository.getMissingGameIds();
   logger.info(`Obtendo a información ${missingGames.length} xogos de Twitch dende a API.`);
   logger.debug(missingGames);
   const refreshedGames = await fetchGames(missingGames);
   logger.debug(refreshedGames);
   // Recuperar os datos dos usuarios dende a API de Twitch
   for (const [index, item] of refreshedGames.entries()) {
      await twitchGameRepository.save(item);
      logger.info(`${index + 1}/${refreshedGames.length}`, `Refrescado a información de ${item.id}: ${item.name}.`);
   }
   logger.info(`Finalizado o refresco de ${missingGames.length} xogos.`);
}