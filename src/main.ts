import refreshBlogs from "./tasks/refreshBlogs.ts";
import logger from "./services/logger.service.ts";
import refreshPodcasts from "./tasks/refreshPodcasts.ts";
import refreshYoutube from "./tasks/refreshYoutube.ts";
import refreshYoutubeStats from "./tasks/refreshYoutubeStats.ts";
import refreshTwitchChannels from "./tasks/refreshTwitchChannels.ts";
import publishDiscord from "./tasks/publishDiscord.ts";
import publishMastodon from "./tasks/publishMastodon.ts";
import publishTwitter from "./tasks/publishTwitter.ts";
import refreshTwitchClips from "./tasks/refreshTwitchClips.ts";
import refreshTwitchGames from "./tasks/refreshTwitchGames.ts";
import refreshTwitchStreams from "./tasks/refreshTwitchStreams.ts";

const task = Deno.args[0];
logger.info(`
------------------------------------------------------------------------------------------
|              Rede Automatizada de Difusión Integral do Obradoiro Dixital               |
|                             Pablo Villaverde Castro © 2024                             |
|                                Obradoiro Dixital Galego                                |
------------------------------------------------------------------------------------------
`);
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
   case "refreshTwitchClips":
      await refreshTwitchClips();
      break;
   case "refreshTwitchGames":
      await refreshTwitchGames();
      break;
   case "refreshTwitchStreams":
      await refreshTwitchStreams();
      break;
   // Service Tasks
   case "publishTwitter":
      await publishTwitter();
      break;
   case "publishMastodon":
      await publishMastodon();
      break;
   case "publishDiscord":
      await publishDiscord();
      break;
   default:
      logger.fatal("Especifica unha subtarefa para executar a RADIO Dixital.");
      break;
}