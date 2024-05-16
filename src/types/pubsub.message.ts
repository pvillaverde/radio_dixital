export default interface PubSubMessage {
   type: "youtube" | "podcast" | "blog";
   title: string;
   entryTitle: string;
   entryLink: string;
   twitter?: string;
   mastodon?: string;
}
