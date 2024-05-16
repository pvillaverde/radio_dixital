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

DROP TRIGGER youtube_create;
CREATE TRIGGER youtube_create
   BEFORE INSERT ON `youtube`
   FOR EACH ROW
   SET NEW.created_at = NOW(),
   NEW.updated_at = NOW();

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

DROP TRIGGER youtube_stats_create;
CREATE TRIGGER youtube_stats_create
   BEFORE INSERT ON `youtube`
   FOR EACH ROW
   SET NEW.created_at = NOW(),
   NEW.updated_at = NOW();

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

DROP TRIGGER podcast_create;
CREATE TRIGGER podcast_create
   BEFORE INSERT ON `podcast`
   FOR EACH ROW
   SET NEW.created_at = NOW(),
   NEW.updated_at = NOW();

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

DROP TRIGGER blog_create;
CREATE TRIGGER blog_create
   BEFORE INSERT ON `blog`
   FOR EACH ROW
   SET NEW.created_at = NOW(),
   NEW.updated_at = NOW();

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
DROP TRIGGER entry_create;
CREATE TRIGGER entry_create
   BEFORE INSERT ON `entry`
   FOR EACH ROW
   SET NEW.created_at = NOW(),
   NEW.updated_at = NOW();

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
