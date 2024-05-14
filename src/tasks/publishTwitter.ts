import { TwitterApi } from 'npm:twitter-api-v2@1.16.4';
import twitterConfig from "../config/twitter.config.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";
import mqttConfig from "../config/mqtt.config.ts";

export default function publishTwitter() {
   mqttService.connect();
   mqttService.on("connect", () => {
      mqttService.subscribe(mqttConfig.MQTT_TOPIC, (err) => {
         if (err) {
            logger.error(err.toString());
         } else {
            logger.info("Listening MQTT Topic")
         }
      });
   })
   mqttService.on("message", async (topic, message) => {
      try {
         const decodedMessage: PubSubMessage = JSON.parse(message.toString());
         logger.debug(decodedMessage);
         if (!twitterConfig[decodedMessage.type].enable) return;
         const messageStatus = twitterConfig[decodedMessage.type].messageTemplate
            .replace(/{channelName}/g, decodedMessage.title)
            .replace(/{mentionUser}/g, decodedMessage.twitter ? ` (${decodedMessage.twitter})` : ``)
            .replace(/{title}/g, decodedMessage.entryTitle)
            .replace(/{url}/g, decodedMessage.entryLink)

         const twitter = new TwitterApi(twitterConfig[decodedMessage.type]);
         const status = await twitter.v2.tweet(messageStatus);
         logger.info(messageStatus, status);
      } catch (error) {
         logger.error(error);
         logger.error(message.toString());
      }
   })
}