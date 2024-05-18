import refreshBlogs from "./tasks/refreshBlogs.ts";
import logger from "./services/logger.service.ts";
import connection from "./database/index.ts";
import refreshPodcasts from "./tasks/refreshPodcasts.ts";
import refreshYoutube from "./tasks/refreshYoutube.ts";
import refreshYoutubeStats from "./tasks/refreshYoutubeStats.ts";
import refreshTwitchChannels from "./tasks/refreshTwitchChannels.ts";
import mqttService from "./services/mqtt.service.ts";
import publishDiscord from "./tasks/publishDiscord.ts";
import publishMastodon from "./tasks/publishMastodon.ts";
import publishTwitter from "./tasks/publishTwitter.ts";

const task = Deno.args[0];
logger.info(`
------------------------------------------------------------------------------------------
|              Rede Automatizada de Difusión Integral do Obradoiro Dixital               |
|                             Pablo Villaverde Castro © 2024                             |
|                                Obradoiro Dixital Galego                                |
------------------------------------------------------------------------------------------
`);
let keepRuning = false;
switch (task) {
   // One-time tasks
   case "refreshBlogs":
      await refreshBlogs();
      break;
   case "refreshPodcasts":
      await refreshPodcasts();
      break;
   case "refreshYoutube":
      await refreshYoutube();
      break;
   case "refreshYoutubeStats":
      await refreshYoutubeStats();
      break;
   case "refreshTwitchChannels":
      await refreshTwitchChannels();
      break;
   // Service Tasks
   case "publishTwitter":
      keepRuning = true;
      await publishTwitter();
      break;
   case "publishMastodon":
      keepRuning = true;
      await publishMastodon();
      break;
   case "publishDiscord":
      keepRuning = true;
      await publishDiscord();
      break;
   default:
      logger.fatal("Especifica unha subtarefa para executar a RADIO Dixital.");
      break;
}

if (!keepRuning) {
   try {
      connection.end();
      mqttService.end();
   } catch (_error) {
      Deno.exit(0);
   }
}
