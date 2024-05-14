import refreshBlogs from "./tasks/refreshBlogs.ts";
import logger from "./services/logger.service.ts";
import connection from "./database/index.ts";
import refreshPodcasts from "./tasks/refreshPodcasts.ts";
import refreshYoutube from "./tasks/refreshYoutube.ts";
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
   case "refreshBlogs":
      await refreshBlogs();
      break;
   case "refreshPodcasts":
      await refreshPodcasts();
      break;
   case "refreshYoutube":
      await refreshYoutube();
      break;
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
   connection.end();
   mqttService.end();
}

// const food = Deno.args[1];
// console.log(`Hello ${name}, I like ${food}!`);

// import { parseArgs } from "jsr:@std/cli/parse-args";

// const flags = parseArgs(Deno.args, {
//    boolean: ["help", "color"],
//    string: ["version"],
//    default: { color: true },
//    negatable: ["color"],
// });
// console.log("Wants help?", flags.help);
// console.log("Version:", flags.version);
// console.log("Wants color?:", flags.color);

// console.log("Other:", flags._);
