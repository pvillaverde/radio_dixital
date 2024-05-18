import { RowDataPacket } from "npm:mysql2";

export default interface ITwitch extends RowDataPacket {
   id: string;
   login: string;
   display_name: string;
   type: string;
   broadcaster_type: string;
   description: string;
   profile_image_url: string;
   offline_image_url: string;
   channel_created_at: Date;
   twitter?: string;
   mastodon?: string;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}
