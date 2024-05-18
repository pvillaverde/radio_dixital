import ITwitch from "../database/models/twitch.model.ts";
import ITwitchGame from "../database/models/twitchGame.model.ts";
import ITwitchStream from "../database/models/twitchStream.model.ts";

export default interface PubSubMessage {
   type: "youtube" | "podcast" | "blog" | 'twitch';
   title: string;
   entryTitle: string;
   entryLink: string;
   twitter?: string;
   mastodon?: string;
   stream?: ITwitchStream,
   game?: ITwitchGame,
   channel?: ITwitch,
}
