import { Webhook } from "npm:simple-discord-webhooks";
import discordConfig from "../config/discord.config.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";
import mqttConfig from "../config/mqtt.config.ts";
import ITwitchStream from "../database/models/twitchStream.model.ts";
import ITwitch from "../database/models/twitch.model.ts";
import ITwitchGame from "../database/models/twitchGame.model.ts";
import DiscordEmbed from "../types/discordEmbed.ts";
import humanizeDuration from "npm:humanize-duration";
import { StreamLiveTracker } from "../types/streamTrackers.ts";

const streamLiveTracker: StreamLiveTracker = {};

export default function publishDiscord() {
   mqttService.connect();
   mqttService.on("reconnect", () => logger.debug("Reconnected to MQTT Broker"));
   mqttService.on("connect", () => {
      mqttService.subscribe(mqttConfig.MQTT_TOPIC, { qos: 2 }, (err) => {
         if (err) {
            logger.error(err.toString());
         } else {
            logger.debug(`Subscribed to "${mqttConfig.MQTT_TOPIC}" MQTT Topic`);
         }
      });
   });
   mqttService.on("message", async (_topic, message, packet) => {
      try {
         const decodedMessage: PubSubMessage = JSON.parse(message.toString());
         logger.debug(decodedMessage, packet);
         if (!discordConfig[decodedMessage.type].enable) return;
         if (decodedMessage.type === "twitch") {
            sendEmbedMessage(decodedMessage);
         } else {
            sendSimpleMessage(decodedMessage);
         }
      } catch (error) {
         logger.error(error);
         logger.error(message.toString());
      }
   });
}

/**
 * sendEmbedMessage - Sends a simple discord message for new content
 * @param {PubSubMessage} decodedMessage - the message decoded from mqtt
 * @returns {void}
 */
async function sendSimpleMessage(decodedMessage: PubSubMessage) {
   const messageStatus = discordConfig[decodedMessage.type].messageTemplate
      .replace(/{channelName}/g, decodedMessage.title)
      .replace(/{mentionUser}/g, ``)
      .replace(/{title}/g, decodedMessage.entryTitle)
      .replace(/{url}/g, decodedMessage.entryLink);

   const webhook = new Webhook(discordConfig[decodedMessage.type].webhook);
   const result = await webhook.send(messageStatus);
   logger.info(messageStatus, result.id);
}

/**
 * sendEmbedMessage - Sends an embed message for live Twitch stream
 * @param {PubSubMessage} decodedMessage - the message decoded from mqtt
 * @returns {void}
 */
async function sendEmbedMessage(decodedMessage: PubSubMessage) {
   if (!decodedMessage.stream || !decodedMessage.channel || !decodedMessage.game) return;
   const embed = createLiveEmbedForStream(decodedMessage.stream, decodedMessage.channel, decodedMessage.game);
   const streamId = decodedMessage.stream.id;
   const webhook = new Webhook(discordConfig[decodedMessage.type].webhook);
   if (streamId in streamLiveTracker) {
      const message = webhook.resolveMessageID(streamLiveTracker[streamId]);
      const result = await message.edit("", [embed]);
      if (decodedMessage.stream.type === "offline") {
         logger.info(`A canle ${decodedMessage.stream.user_name} comezou a emitir ${decodedMessage.stream.game_name}: ${decodedMessage.stream.title}`, result.id)
         delete streamLiveTracker[streamId];
      } else {
         logger.info(`Actualizando o directo da canle ${decodedMessage.stream.user_name} =>  ${decodedMessage.stream.game_name}: ${decodedMessage.stream.title}`, result.id)
      }
   } else {
      logger.info(`A canle ${decodedMessage.stream.user_name} comezou a emitir ${decodedMessage.stream.game_name}: ${decodedMessage.stream.title}`)
      const result = await webhook.send("", [embed]);
      streamLiveTracker[streamId] = result.id;
   }
}

/**
 * createLiveEmbedForStream - creates a DiscordEmbed object for a live Twitch stream
 * @param {ITwitchStream} stream - the Twitch stream object
 * @param {ITwitch} channel - the Twitch channel object
 * @param {ITwitchGame} game - the Twitch game object
 * @returns {DiscordEmbed} liveEmbed - the DiscordEmbed object for the live stream
 */
export function createLiveEmbedForStream(stream: ITwitchStream, channel: ITwitch, game: ITwitchGame) {
   const isLive = stream.type === "live";
   const liveEmbed: DiscordEmbed = {
      title: stream.title as string,
      url: `https://twitch.tv/${(stream.user_login as string || stream.user_name as string).toLowerCase()}`,
      fields: [],
   }
   if (game && game.box_art_url) {
      liveEmbed.thumbnail = { url: (game.box_art_url as string).replace('{width}', '288').replace('{height}', '384') };
   }
   // Add game
   switch (stream.game_name) {
      case 'Just Chatting':
         liveEmbed.fields?.push({ name: "A que andamos?", value: "De Parola™", inline: false })
         break;
      case 'Talk Shows & Podcasts':
         liveEmbed.fields?.push({ name: "A que andamos?", value: "Podcasts e De Parola™", inline: false })
         break;
      default:
         liveEmbed.fields?.push({ name: "A que andamos?", value: stream.game_name as string, inline: false })
         break;
   }
   // Etiquetas
   if (stream.tags) {
      liveEmbed.fields?.push({ name: "Etiquetas", value: stream.tags as string, inline: false })
   }
   if (isLive) {
      // Se o stream está en directo
      liveEmbed.color = 0x9146ff;
      liveEmbed.author = { name: `${stream.user_name} está agora en directo!`, icon_url: channel.profile_image_url as string }
      liveEmbed.description = `Axiña, [preme para velo en twitch](https://twitch.tv/${(stream.user_login as string || stream.user_name as string).toLowerCase()})`;
      if (stream.thumbnail_url) {
         const thumbnailBuster = (Date.now() / 1000).toFixed(0);
         liveEmbed.image = {
            url: (stream.thumbnail_url as string).replace('{width}', '1280').replace('{height}', '720') + `?t=${thumbnailBuster}`,
         }
      }
      liveEmbed.fields?.push({ name: "Estado", value: `:red_circle: Emitindo con ${stream.viewer_count} espectadores`, inline: true })
   } else {
      // Se xa rematou o directo.
      liveEmbed.color = 0x808080;
      liveEmbed.author = { name: `${stream.user_name} estivo en directo!**`, icon_url: channel.profile_image_url as string }
      liveEmbed.fields?.push({ name: "Estado", value: `:white_circle: A emisión xa rematou.`, inline: true })
   }
   // Add uptime
   const now = new Date(stream.ended_at as Date).getTime();
   const startedAt = new Date(stream.started_at as Date).getTime();
   const streamDuration = humanizeDuration((now - startedAt), {
      delimiter: ', ',
      largest: 2,
      round: true,
      units: ['y', 'mo', 'w', 'd', 'h', 'm'],
      language: 'gl',
      fallbacks: ['gl', 'es'],
   });
   liveEmbed.fields?.push({ name: "Tempo en emisión", value: streamDuration, inline: true });
   return liveEmbed;
}