import logger from "../services/logger.service.ts";
import mqttService from "../services/mqtt.service.ts";
import mqttConfig from "../config/mqtt.config.ts";

const topic = "test"
let keepRuning = true;
let id = 0;
mqttService.connect();
mqttService.on("reconnect", () => logger.info("Reconnected to MQTT Broker"));
mqttService.on("connect", () => {
   mqttService.subscribe("test", { qos: 2 }, (err) => {
      if (err) {
         logger.error(err.toString());
      } else {
         logger.info(`Subscribed to "test" MQTT Topic`);
      }
      sendMessage();
   });
});
mqttService.on("message", async (_topic, message, packet) => {
   try {
      logger.info(_topic, message.toString(), packet)
   } catch (error) {
      logger.error(error);
      logger.error(message.toString());
   }
});

async function sendMessage() {
   await new Promise<void>((resolve, reject) => setTimeout(resolve, 1000));
   id++;
   const message = {
      id: id
   }
   mqttService.publish("test", JSON.stringify(message), { qos: 2 });
   /* logger.info(`Publishing to MQTT topic "test"`, JSON.stringify(message)); */
   sendMessage();
}


if (!keepRuning) {
   try {
      mqttService.end();
   } catch (_error) {
      Deno.exit(0);
   }
}
