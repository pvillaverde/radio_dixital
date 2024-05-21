import { connectAsync } from "npm:mqtt";
import mqttConfig from "../config/mqtt.config.ts";
import logger from "./logger.service.ts";
const mqttService = await connectAsync(`mqtt://${mqttConfig.MQTT_HOST}`, {
   username: mqttConfig.MQTT_USER,
   password: mqttConfig.MQTT_PASS,
});

mqttService.on("reconnect", () => logger.debug("Reconnected to MQTT Broker"));

export default mqttService;