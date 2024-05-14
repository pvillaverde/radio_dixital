import refreshBlogs from "./tasks/refreshBlogs.ts";
import logger from "./services/logger.service.ts";
import connection from "./database/index.ts";
import refreshPodcasts from "./tasks/refreshPodcasts.ts";
import refreshYoutube from "./tasks/refreshYoutube.ts";
const task = Deno.args[0];

logger.info(`
------------------------------------------------------------------------------------------
|              Rede Automatizada de Difusión Integral do Obradoiro Dixital               |
|                             Pablo Villaverde Castro © 2024                             |
|                                Obradoiro Dixital Galego                                |
------------------------------------------------------------------------------------------
`);
switch (task) {
   case "refreshBlogs":
      await refreshBlogs();
      connection.end();
      break;
   case "refreshPodcasts":
      await refreshPodcasts();
      connection.end();
      break;
   case "refreshYoutube":
      await refreshYoutube();
      connection.end();
      break;
   default:
      logger.fatal("Especifica unha subtarefa para executar a RADIO Dixital.");
      connection.end();
      break;
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
