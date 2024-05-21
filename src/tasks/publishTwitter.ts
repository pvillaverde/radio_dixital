import { TwitterApi } from "npm:twitter-api-v2@1.16.4";
import twitterConfig from "../config/twitter.config.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";
import mqttConfig from "../config/mqtt.config.ts";
import { StreamTimeTracker } from "../types/streamTrackers.ts";

const streamTimeTracker: StreamTimeTracker = {};

export default function publishTwitter() {
   mqttService.subscribe(mqttConfig.MQTT_TOPIC, { qos: 2 }, (err) => {
      if (err) {
         logger.error(err.toString());
      } else {
         logger.debug(`Subscribed to "${mqttConfig.MQTT_TOPIC}" MQTT Topic`);
      }
   });
   mqttService.on("message", async (_topic, message, packet) => {
      try {
         const decodedMessage: PubSubMessage = JSON.parse(message.toString());
         logger.debug(decodedMessage, packet);
         if (!twitterConfig[decodedMessage.type].enable) return;
         if (decodedMessage.type === "twitch" && decodedMessage.stream) {
            const streamId = decodedMessage.stream.id;
            const currentTimestamp = Date.now();

            // Clean old messages
            cleanOldStreams();

            // Check if the message ID is already processed within the last hour
            if (streamId in streamTimeTracker) {
               logger.debug(`Xa se enviou notificación da emisión da canle ${decodedMessage.title} =>  ${decodedMessage.entryTitle}, ignorandoa.`);
               return;
            }
            // Store the message ID with the current timestamp
            streamTimeTracker[streamId] = currentTimestamp;
         }
         const messageStatus = twitterConfig[decodedMessage.type].messageTemplate
            .replace(/{channelName}/g, decodedMessage.title)
            .replace(/{mentionUser}/g, decodedMessage.twitter ? ` (${decodedMessage.twitter})` : ``)
            .replace(/{title}/g, decodedMessage.entryTitle)
            .replace(/{url}/g, decodedMessage.entryLink);

         const twitter = new TwitterApi(twitterConfig[decodedMessage.type]);
         const status = await twitter.v2.tweet(messageStatus);
         logger.info(messageStatus, status);
      } catch (error) {
         logger.error(error);
         logger.error(message.toString());
      }
   });
}

function cleanOldStreams() {
   const fourHoursAgo = Date.now() - (4 * 3600 * 1000); // 4 hour in milliseconds
   for (const id in streamTimeTracker) {
      if (streamTimeTracker[id] < fourHoursAgo) {
         delete streamTimeTracker[id];
      }
   }
}
