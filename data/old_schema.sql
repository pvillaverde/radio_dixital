ALTER TABLE twitch_channel_follows
   DROP CONSTRAINT FKFCBB8B3AB5F355EA;

ALTER TABLE twitch_channel_stats
   DROP CONSTRAINT FKB4444AF7B5F355EA;

ALTER TABLE twitch_clips
   DROP CONSTRAINT FK654E4FB7B5F355EA;

ALTER TABLE twitch_streams
   DROP CONSTRAINT FKA77D5487B5F355EA;

ALTER TABLE youtube_channel_stats
   DROP CONSTRAINT FK5ADCDA4797580D3A;

ALTER TABLE twitch_stream_views
   DROP CONSTRAINT FKA0A495DBC5387FC7;

DROP TABLE twitch_channel_follows;

DROP TABLE twitch_channel_stats;

DROP TABLE twitch_games;

DROP TABLE podcast_channels;

DROP TABLE twitch_clips;

DROP TABLE twitch_streams;

DROP TABLE youtube_channel_stats;

DROP TABLE twitch_channels;

DROP TABLE youtube_channels;

DROP TABLE twitch_stream_views;

-- ALTER TABLE
--     table_name
--     CONVERT TO CHARACTER SET utf8mb4
--     COLLATE utf8mb4_unicode_ci;
-- ALTER TABLE database.table MODIFY COLUMN column_name VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
CREATE TABLE twitch_channel_follows(
   follow_id integer NOT NULL,
   from_id varchar(255),
   from_login varchar(255),
   from_name varchar(255),
   user_id varchar(255),
   user_login varchar(255),
   user_name varchar(255),
   followed_at timestamp,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchchannel_id varchar(255),
   PRIMARY KEY (follow_id)
);

CREATE TABLE twitch_channel_stats(
   stats_id integer NOT NULL,
   view_count integer,
   follow_count integer,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchchannel_id varchar(255),
   PRIMARY KEY (stats_id)
);

CREATE TABLE twitch_games(
   game_id varchar(255) NOT NULL,
   name varchar(255),
   box_art_url varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (game_id)
);

CREATE TABLE podcast_channels(
   rss varchar(255) NOT NULL,
   channel_name varchar(255),
   channel_date timestamp,
   type VARCHAR(255),
   twitter varchar(255),
   mastodon varchar(255),
   last_podcast_date timestamp,
   last_podcast_title varchar(255),
   last_podcast_link varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (rss)
);

CREATE TABLE blog_sites(
   rss varchar(255) NOT NULL,
   channel_name varchar(255),
   channel_date timestamp,
   type VARCHAR(255),
   twitter varchar(255),
   mastodon varchar(255),
   last_entry_date timestamp,
   last_entry_title varchar(255),
   last_entry_link varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (rss)
);

CREATE TABLE twitch_clips(
   clip_id varchar(255) NOT NULL,
   embed_url varchar(255),
   broadcaster_id varchar(255),
   broadcaster_name varchar(255),
   creator_id varchar(255),
   creator_name varchar(255),
   game_id varchar(255),
   language VARCHAR
(255),
   title varchar(255),
   view_count integer,
   clip_created_at timestamp,
   thumbnail_url varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchchannel_id varchar(255),
   PRIMARY KEY (clip_id)
);

CREATE TABLE twitch_streams(
   stream_id varchar(255) NOT NULL,
   type VARCHAR(255),
   user_id varchar(255),
   user_login varchar(255),
   user_name varchar(255),
   game_id varchar(255),
   game_name varchar(255),
   title varchar(255),
   viewer_count integer,
   started_at timestamp,
   ended_at timestamp,
   thumbnail_url varchar(255),
   language VARCHAR
(255),
   tags varchar(255),
   is_mature boolean,
   live_messages text,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchchannel_id varchar(255),
   PRIMARY KEY (stream_id)
);

CREATE TABLE twitch_stream_views(
   streamview_id integer NOT NULL AUTO_INCREMENT,
   view_count integer,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchstream_id varchar(255),
   PRIMARY KEY (streamview_id)
);

CREATE TABLE twitch_channels(
   channel_id varchar(255) NOT NULL,
   login VARCHAR(255),
   display_name varchar(255),
   type VARCHAR(255),
   broadcaster_type varchar(255),
   description text,
   profile_image_url varchar(255),
   offline_image_url varchar(255),
   view_count integer,
   channel_created_at timestamp,
   twitter varchar(255),
   mastodon varchar(255),
   disabled boolean DEFAULT FALSE,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (channel_id)
);

CREATE TABLE youtube_channels(
   channel_uuid varchar(255) NOT NULL,
   channel_name varchar(255),
   channel_date timestamp,
   type VARCHAR(255),
   twitter varchar(255),
   mastodon varchar(255),
   last_video_date timestamp,
   last_video_title varchar(255),
   last_video_link varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (channel_uuid)
);

CREATE TABLE youtube_channel_stats(
   channel_stats_id integer NOT NULL,
   hidden_subscriber_count boolean,
   view_count integer,
   subscriber_count integer,
   video_count integer,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   youtubechannel_id varchar(255),
   PRIMARY KEY (channel_stats_id)
);

ALTER TABLE twitch_channel_follows
   ADD CONSTRAINT FKFCBB8B3AB5F355EA FOREIGN KEY (twitchchannel_id) REFERENCES twitch_channels(channel_id);

ALTER TABLE twitch_channel_stats
   ADD CONSTRAINT FKB4444AF7B5F355EA FOREIGN KEY (twitchchannel_id) REFERENCES twitch_channels(channel_id);

ALTER TABLE twitch_clips
   ADD CONSTRAINT FK654E4FB7B5F355EA FOREIGN KEY (twitchchannel_id) REFERENCES twitch_channels(channel_id);

ALTER TABLE twitch_streams
   ADD CONSTRAINT FKA77D5487B5F355EA FOREIGN KEY (twitchchannel_id) REFERENCES twitch_channels(channel_id);

ALTER TABLE youtube_channel_stats
   ADD CONSTRAINT FK5ADCDA4797580D3A FOREIGN KEY (youtubechannel_id) REFERENCES youtube_channels(channel_uuid);

ALTER TABLE twitch_stream_views
   ADD CONSTRAINT FKA0A495DBC5387FC7 FOREIGN KEY (twitchstream_id) REFERENCES twitch_streams(stream_id);

-- SELECT  table_name,column_name,column_default,data_type,column_default,is_nullable FROM information_schema.columns WHERE table_schema='kirfed_obradoirodixital' AND column_name LIKE '%_at';
-- SELECT column_name,column_default,data_type,column_default,is_nullable FROM information_schema.columns WHERE table_name='twitch_streams';
