import { Webhook } from "npm:simple-discord-webhooks";
import discordConfig from "../config/discord.config.ts";
import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import PubSubMessage from "../types/pubsub.message.ts";
import mqttConfig from "../config/mqtt.config.ts";

export default function publishDiscord() {
   mqttService.connect();
   mqttService.on("connect", () => {
      mqttService.subscribe(mqttConfig.MQTT_TOPIC, (err) => {
         if (err) {
            logger.error(err.toString());
         } else {
            logger.info("Listening MQTT Topic");
         }
      });
   });
   mqttService.on("message", async (_topic, message) => {
      try {
         const decodedMessage: PubSubMessage = JSON.parse(message.toString());
         logger.debug(decodedMessage);
         if (!discordConfig[decodedMessage.type].enable) return;
         const messageStatus = discordConfig[decodedMessage.type].messageTemplate
            .replace(/{channelName}/g, decodedMessage.title)
            .replace(/{mentionUser}/g, ``)
            .replace(/{title}/g, decodedMessage.entryTitle)
            .replace(/{url}/g, decodedMessage.entryLink);

         const webhook = new Webhook(discordConfig[decodedMessage.type].webhook);
         const result = await webhook.send(messageStatus);
         logger.info(messageStatus, result.id);
      } catch (error) {
         logger.error(error);
         logger.error(message.toString());
      }
   });

   // // const hook = new Webhook("YOUR WEBHOOK URL");

   // // const IMAGE_URL = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';
   // // hook.setUsername('Discord Webhook Node Name');
   // // hook.setAvatar(IMAGE_URL);

   // // hook.send("Hello there!");
   // const embed = {};

   // hook.send("This message should get edited (hopefully) soon").then(async (result) => {
   //    setTimeout(async () => {
   //       await result.edit("And should get deleted (hopefully) soon");
   //       console.log("Successfully edited send message!");
   //    }, 3000);
   //    setTimeout(async () => {
   //       await result.delete();
   //       console.log("Successfully deleted send message!");
   //    }, 6000);
   // });

   // const message = hook.resolveMessageID("820311219432194068");
   // message.edit("Hello there!").then(() => console.log("Edited message"));

   // // const embed = new MessageBuilder()
   // //    .setTitle('My title here')
   // //    .setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
   // //    .setUrl('https://www.google.com')
   // //    .addField('First field', 'this is inline', true)
   // //    .addField('Second field', 'this is not inline')
   // //    .setColor(0x9146ff)
   // //    .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
   // //    .setDescription('Oh look a description :)')
   // //    .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
   // //    .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
   // //    .setTimestamp();

   // // hook.send(embed).catch(console.error);

   // // window.sessionStorage.setItem('K1', 'V1');
   // // window.sessionStorage.setItem('K2', JSON.stringify({a: 1, b: '2'}));window.sessionStorage.getItem('K1'); //V1
   // // window.sessionStorage.getItem('K2')); //{"a":1,"b":"2"}
   // // window.sessionStorage.getItem('K3'); //null
   // // window.sessionStorage.length; //2window.sessionStorage.removeItem('K1');
   // // window.sessionStorage.removeItem('K3');window.sessionStorage.getItem('K1'); //null
   // // window.sessionStorage.getItem('K2'); //{"a":1,"b":"2"}window.sessionStorage.length; //1
   // // window.sessionStorage.clear();
   // // window.sessionStorage.length; //0
}
