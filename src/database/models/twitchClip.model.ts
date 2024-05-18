import { RowDataPacket } from "npm:mysql2";

export default interface ITwitchClip extends RowDataPacket {
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
   clip_created_at: Date;
   thumbnail_url: Date;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}