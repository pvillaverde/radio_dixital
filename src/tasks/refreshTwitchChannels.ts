import twitchRepository from "../database/repositories/twitch.repository.ts";
import logger from "../services/logger.service.ts";
import { fetchChannelFollowers, fetchUsers } from "../services/twitch.service.ts";
import { fetchJsonData } from "../services/utils.service.ts";
import { TwitchData } from "../types/api.ts";
import { TwitchUserData } from "../types/twitchApi.ts";
import connection from "../database/index.ts";

export default async function refreshTwitchChannels() {
   const API_URL = "https://obradoirodixitalgalego.gal/api/twitch.json";
   const twitchChannels: TwitchData[] = await fetchJsonData(API_URL);
   logger.info(`Refrescando ${twitchChannels.length} canles de Twitch dende a API.`);
   // Recuperar os datos dos usuarios dende a API de Twitch
   const channelNames = twitchChannels.map(c => c.twitch_login);
   const twitchChannelsData: TwitchUserData[] = await fetchUsers(channelNames);
   // Deshabilitar todos os usuarios (serán rehabilitados se están na API da WEB)
   await twitchRepository.disableAll();
   for (const [index, item] of twitchChannelsData.entries()) {
      // Link social media in the database
      const apiChannel = twitchChannels.find(c => c.twitch_login == item.login);
      if (apiChannel) {
         item.twitter = apiChannel.twitter;
         item.mastodon = apiChannel.mastodon;
      }
      const savedChannel = await twitchRepository.save(item);
      // Obter os seguidores e gardalos nas estatísticas
      const followers = await fetchChannelFollowers(item.id);
      await twitchRepository.saveFollowers(savedChannel, followers);
      logger.info(`${index + 1}/${twitchChannelsData.length}`, `Actualizadas estatísticas de ${item.display_name} con ${followers} seguidores.`);
   }
   logger.info(`Finalizado o refresco de ${twitchChannels.length} canles de Twitch.`);
   connection.end();
}