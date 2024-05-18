ALTER TABLE entry
   DROP CONSTRAINT fk_entry_youtube;

ALTER TABLE entry
   DROP CONSTRAINT fk_entry_podcast;

ALTER TABLE entry
   DROP CONSTRAINT fk_entry_blog;

ALTER TABLE youtube_stats
   DROP CONSTRAINT fk_youtube_stats_youtube;

DROP TABLE youtube;

DROP TABLE podcast;

DROP TABLE blog;

DROP TABLE entry;

DROP TABLE youtube_stats;


/* Youtube Channels */
CREATE TABLE youtube(
   id varchar(255) NOT NULL,
   uuid varchar(255) NOT NULL UNIQUE,
   title varchar(255) NOT NULL,
   published timestamp,
   /* Auto updated with trigger */
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

DROP TRIGGER youtube_update;
CREATE TRIGGER youtube_update
   BEFORE UPDATE ON `youtube`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

CREATE TABLE youtube_stats(
   id integer NOT NULL AUTO_INCREMENT,
   hidden_subscriber_count boolean,
   view_count integer,
   subscriber_count integer,
   video_count integer,
   channel_uuid varchar(255) NOT NULL,
   youtube_id varchar(255) NOT NULL,
   /* Auto updated with trigger */
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

DROP TRIGGER youtube_stats_update;
CREATE TRIGGER youtube_stats_update
   BEFORE UPDATE ON `youtube`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

/* Podcasts */
CREATE TABLE podcast(
   id varchar(255) NOT NULL,
   rss varchar(255) NOT NULL,
   title varchar(255) NOT NULL,
   published timestamp,
   /* Auto updated with trigger */
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

DROP TRIGGER podcast_update;
CREATE TRIGGER podcast_update
   BEFORE UPDATE ON `podcast`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;


/* Blog Sites*/
CREATE TABLE blog(
   id varchar(255) NOT NULL,
   rss varchar(255) NOT NULL,
   title varchar(255) NOT NULL,
   published timestamp,
   /* Auto updated with trigger */
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

DROP TRIGGER blog_update;
CREATE TRIGGER blog_update
   BEFORE UPDATE ON `blog`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;


/* Entries, common for Blog, Youtube & Podcast */
CREATE TABLE entry(
   id integer NOT NULL AUTO_INCREMENT,
   type varchar(255) NOT NULL,
   date timestamp NOT NULL,
   title varchar(500) NOT NULL,
   link varchar(500) NOT NULL,
   youtube_id varchar(255),
   podcast_id varchar(255),
   blog_id varchar(255),
   /* Auto updated with trigger */
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

DROP TRIGGER entry_update;
CREATE TRIGGER entry_update
   BEFORE UPDATE ON `entry`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

ALTER TABLE entry
   ADD CONSTRAINT fk_entry_youtube FOREIGN KEY (youtube_id) REFERENCES youtube(id);

ALTER TABLE entry
   ADD CONSTRAINT fk_youtube_stats_youtube FOREIGN KEY (youtube_id) REFERENCES youtube(id);

ALTER TABLE entry
   ADD CONSTRAINT fk_entry_podcast FOREIGN KEY (podcast_id) REFERENCES podcast(id);

ALTER TABLE entry
   ADD CONSTRAINT fk_entry_blog FOREIGN KEY (blog_id) REFERENCES blog(id);


/* ############################################################ */
/* ####################### TWITCH TABLES ###################### */
/* ############################################################ */

CREATE TABLE twitch_channels(
   id varchar(255) NOT NULL,
   login VARCHAR(255) NOT NULL UNIQUE,
   display_name varchar(255),
   type VARCHAR(255),
   broadcaster_type varchar(255),
   description text,
   profile_image_url varchar(255),
   offline_image_url varchar(255),
   channel_created_at timestamp,
   enabled boolean DEFAULT TRUE,
   twitter VARCHAR(255),
   mastodon VARCHAR(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
);

CREATE TRIGGER twitch_channels_update
   BEFORE UPDATE ON `twitch_channels`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;


CREATE TABLE twitch_channels_stats(
   id integer NOT NULL AUTO_INCREMENT,
   follow_count integer,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchchannel_id varchar(255),
   PRIMARY KEY (id)
);

DROP TRIGGER twitch_channel_stats_update;
CREATE TRIGGER twitch_channel_stats_update
   BEFORE UPDATE ON `twitch_channel_stats`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

ALTER TABLE twitch_channels_stats
   ADD CONSTRAINT twitch_channels_stats FOREIGN KEY (twitchchannel_id) REFERENCES twitch_channels(id);

CREATE TABLE twitch_clips(
   id varchar(255) NOT NULL,
   url varchar(255),
   embed_url varchar(255),
   broadcaster_id varchar(255),
   broadcaster_name varchar(255),
   creator_id varchar(255),
   creator_name varchar(255),
   game_id varchar(255),
   language VARCHAR(255),
   title varchar(255),
   view_count integer,
   clip_created_at timestamp,
   thumbnail_url varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (clip_id)
);

DROP TRIGGER twitch_clips_update;
CREATE TRIGGER twitch_clips_update
   BEFORE UPDATE ON `twitch_clips`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

ALTER TABLE twitch_clips
   ADD CONSTRAINT twitch_clips_channels FOREIGN KEY (broadcaster_id) REFERENCES twitch_channels(id);

CREATE TABLE twitch_streams(
   id varchar(255) NOT NULL,
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
   language VARCHAR(255),
   tags varchar(255),
   is_mature boolean,
   live_messages text,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
);
ALTER TABLE twitch_streams
   ADD CONSTRAINT twitch_streams_channels FOREIGN KEY (user_id) REFERENCES twitch_channels(id);


DROP TRIGGER twitch_streams_update;
CREATE TRIGGER twitch_streams_update
   BEFORE UPDATE ON `twitch_streams`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

CREATE TABLE twitch_streams_views(
   streamview_id integer NOT NULL AUTO_INCREMENT,
   view_count integer,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   twitchstream_id varchar(255),
   PRIMARY KEY (streamview_id)
);
ALTER TABLE twitch_streams_views
   ADD CONSTRAINT twitch_streams_views_streams FOREIGN KEY (twitchstream_id) REFERENCES twitch_streams(id);

DROP TRIGGER twitch_streams_views_update;
CREATE TRIGGER twitch_streams_views_update
   BEFORE UPDATE ON `twitch_streams_views`
   FOR EACH ROW
   SET NEW.updated_at = NOW(),
   NEW.created_at = OLD.created_at;

CREATE TABLE twitch_games(
   id varchar(255) NOT NULL,
   name varchar(255),
   box_art_url varchar(255),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
);