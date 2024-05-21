import mqttConfig from "../config/mqtt.config.ts";
import twitchRepository from "../database/repositories/twitch.repository.ts";
import twitchGameRepository from "../database/repositories/twitchGame.repository.ts";
import twitchStreamRepository from "../database/repositories/twitchStream.repository.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import { fetchStreams } from "../services/twitch.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";

export default async function refreshTwitchStreams() {
   const twitchChannels = await twitchRepository.retrieveAll({ enabled: true });
   logger.info(`Refrescando os streams de ${twitchChannels.length} canles de Twitch dende a API.`);
   // Recuperar os datos dos streams dende a API de Twitch e gardalos na base de datos cos espectadores actuais.
   const channelNames = twitchChannels.map(c => c.login);
   const activeTwitchStreams = await fetchStreams(channelNames);
   for (const [index, item] of activeTwitchStreams.entries()) {
      const savedStream = await twitchStreamRepository.save(item);
      await twitchStreamRepository.saveViews(savedStream);
      logger.info(`${index + 1}/${activeTwitchStreams.length}`, `Actualizando o directo da canle ${savedStream.user_name} =>  ${savedStream.game_name}: ${savedStream.title}`)
   }
   logger.info(`Actualizados na base de datos ${activeTwitchStreams.length} emisións activas de Twitch.`);
   // Xestionar as notificacións
   const liveStreams = await twitchStreamRepository.retrieveAll({ live: true });
   for (const stream of liveStreams) {
      const channel = await twitchRepository.retrieveById(stream.user_id);
      const game = await twitchGameRepository.retrieveById(stream.game_id);
      // Se hai máis de 5 minutos que non temos novidades deste directo... rematou.
      if (new Date(stream.ended_at as Date) <= new Date(Date.now() - 1000 * 60 * 5)) {
         logger.info(`Directo Finalizado de ${stream.user_name}`)
         stream.type = "offline";
         await twitchStreamRepository.update(stream);
      } else {
         logger.info(`Actualizando o directo da canle ${stream.user_name} =>  ${stream.game_name}: ${stream.title}`)
      }
      const message: PubSubMessage = {
         type: "twitch",
         title: stream.user_name,
         mastodon: channel.mastodon,
         twitter: channel.twitter,
         entryTitle: `${stream.title} (${stream.game_name})`,
         entryLink: `https://twitch.tv/${stream.user_login}`,
         stream: stream,
         channel: channel,
         game: game,
      };
      mqttService.publish(mqttConfig.MQTT_TOPIC, JSON.stringify(message), { qos: 2 });
   }
   mqttService.end();
   Deno.exit(0);
}