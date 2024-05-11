import { RowDataPacket } from "npm:mysql2"

export default interface IEntry extends RowDataPacket {
   id: number;
   type: 'youtube' | 'podcast' | 'blog'
   date: Date;
   title: string;
   link: string;
   // Foreign Keys
   youtube_id?: string;
   podcast_id?: string;
   blog_id?: string;
}