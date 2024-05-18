import { createRestAPIClient } from "npm:masto@6.7.7";
import mastodonConfig from "../config/mastodon.config.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";
import mqttConfig from "../config/mqtt.config.ts";
import StreamTracker from "../types/streamTracker.ts";

const streamTracker: StreamTracker = {};
let subscribed = false;

export default function publishMastodon() {
   mqttService.connect();
   mqttService.on("reconnect", () => logger.info("Reconnected to MQTT Broker"));
   mqttService.on("connect", () => {
      if (subscribed) return;
      mqttService.subscribe(mqttConfig.MQTT_TOPIC, (err) => {
         if (err) {
            logger.error(err.toString());
         } else {
            subscribed = true;
            logger.info(`Subscribed to "${mqttConfig.MQTT_TOPIC}" MQTT Topic`);
         }
      });
   });
   mqttService.on("message", async (_topic, message) => {
      try {
         const decodedMessage: PubSubMessage = JSON.parse(message.toString());
         logger.debug(decodedMessage);
         if (!mastodonConfig[decodedMessage.type].enable) return;
         if (decodedMessage.type === "twitch" && decodedMessage.stream) {
            const streamId = decodedMessage.stream.id;
            const currentTimestamp = Date.now();

            // Clean old messages
            cleanOldStreams();

            // Check if the message ID is already processed within the last hour
            if (streamId in streamTracker) {
               logger.debug(`Xa se enviou notificación da emisión da canle ${decodedMessage.title} =>  ${decodedMessage.entryTitle}, ignorandoa.`);
               return;
            }
            // Store the message ID with the current timestamp
            streamTracker[streamId] = currentTimestamp;
         }
         const messageStatus = mastodonConfig[decodedMessage.type].messageTemplate
            .replace(/{channelName}/g, decodedMessage.title)
            .replace(/{mentionUser}/g, decodedMessage.mastodon ? ` (${decodedMessage.mastodon})` : ``)
            .replace(/{title}/g, decodedMessage.entryTitle)
            .replace(/{url}/g, decodedMessage.entryLink);

         const mastodon = await createRestAPIClient(mastodonConfig[decodedMessage.type]);
         const status = await mastodon.v1.statuses.create({ status: messageStatus, visibility: "public" });
         logger.info(messageStatus, status.url);
      } catch (error) {
         logger.error(error);
         logger.error(message.toString());
      }
   });
}

function cleanOldStreams() {
   const fourHoursAgo = Date.now() - (4 * 3600 * 1000); // 4 hour in milliseconds
   for (const id in streamTracker) {
      if (streamTracker[id] < fourHoursAgo) {
         delete streamTracker[id];
      }
   }
}