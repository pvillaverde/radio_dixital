import { RowDataPacket } from "npm:mysql2";

export default interface ITwitchStream extends RowDataPacket {
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
   tags: string;
   is_mature: boolean;
   live_messages: string;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}