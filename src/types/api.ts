export interface BaseApiData {
   id: string;
   title: string;
   twitter?: string;
   mastodon?: string;
}

export interface YoutubeData extends BaseApiData {
   type: 'youtube';
   uuid: string;
}

export interface PodcastData extends BaseApiData {
   type: 'podcast';
   rss: string;
}

export interface BlogData extends BaseApiData {
   type: 'blog';
   rss: string;
}

export interface TwitchData extends BaseApiData {
   type: 'twitch';
   twitch_login: string;
}

