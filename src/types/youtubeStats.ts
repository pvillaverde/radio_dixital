export default interface YoutubeStat {
   id?: number;
   hidden_subscriber_count: boolean;
   view_count: number;
   subscriber_count: number;
   video_count: number;
   channel_uuid: string;
   youtube_id: string;
   // Auto filled with Triggers
   created_at?: Date;
   updated_at?: Date;
}