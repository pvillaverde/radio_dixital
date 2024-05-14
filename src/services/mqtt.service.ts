import { connect } from "npm:mqtt";
import mqttConfig from "../config/mqtt.config.ts";
export default connect(`mqtt://${mqttConfig.MQTT_HOST}`, {
   username: mqttConfig.MQTT_USER,
   password: mqttConfig.MQTT_PASS,
   manualConnect: true,
});