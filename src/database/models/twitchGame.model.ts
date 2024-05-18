import { RowDataPacket } from "npm:mysql2";

export default interface ITwitchGame extends RowDataPacket {
   id: string;
   name: string;
   box_art_url: string;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}