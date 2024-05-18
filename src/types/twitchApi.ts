export interface TwitchUserData {
   id: string;
   login: string;
   display_name: string;
   type: string;
   broadcaster_type: string;
   description: string;
   profile_image_url: string;
   offline_image_url: string;
   created_at: Date;
   twitter?: string;
   mastodon?: string;
}

export interface TwitchStreamData {
   id: string;
   type: string;
   user_id: string;
   user_login: string;
   user_name: string;
   game_id: string;
   game_name: string;
   title: string;
   viewer_count: number;
   started_at: Date;
   ended_at: Date;
   thumbnail_url: string;
   language: string;
   is_mature: boolean;
   tags: string[];
   live_messages: string;
}

export interface TwitchGameData {
   id: string;
   name: string;
   box_art_url: string,
}

export interface TwitchFollowersData {
   viewCount: number;
   followCount: number;
   from_id: string;
   from_login: string;
   from_name: string;
   user_id: string;
   user_login: string;
   user_name: string;
   followed_at: Date;

   twitchchannelId?: string;
}

export interface TwitchClipData {
   id: string;
   url: string;
   embed_url: string;
   broadcaster_id: string;
   broadcaster_name: string;
   creator_id: string;
   creator_name: string;
   game_id: string;
   language: string;
   title: string;
   view_count: number;
   created_at: Date;
   thumbnail_url: string;
}