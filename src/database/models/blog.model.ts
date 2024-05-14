import { RowDataPacket } from "npm:mysql2";

export default interface IBlog extends RowDataPacket {
   id: string;
   rss: string;
   title: string;
   published?: Date;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}
