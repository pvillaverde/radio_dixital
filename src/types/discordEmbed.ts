export default interface DiscordEmbed {
   /** Title of embed */
   title?: string;
   /** Description of embed */
   description?: string;
   /** Url of embed */
   url?: string;
   /** Color code of the embed */
   color?: number;

   /** Timestamp of embed content */
   timestamp?: string;
   /** Footer information */
   footer?: DiscordEmbedFooter;
   /** Image information */
   image?: DiscordEmbedImage;
   /** Thumbnail information */
   thumbnail?: DiscordEmbedThumbnail;
   /** Author information */
   author?: DiscordEmbedAuthor;
   /** Fields information */
   fields?: DiscordEmbedField[];
}


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure */
export interface DiscordEmbedThumbnail {
   /** Source url of thumbnail (only supports http(s) and attachments) */
   url: string;
   /** A proxied url of the thumbnail */
   proxy_url?: string;
   /** Height of thumbnail */
   height?: number;
   /** Width of thumbnail */
   width?: number;
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure */
export interface DiscordEmbedImage {
   /** Source url of image (only supports http(s) and attachments) */
   url: string;
   /** A proxied url of the image */
   proxy_url?: string;
   /** Height of image */
   height?: number;
   /** Width of image */
   width?: number;
}
/** https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure */
export interface DiscordEmbedFooter {
   /** Footer text */
   text: string;
   /** Url of footer icon (only supports http(s) and attachments) */
   icon_url?: string;
   /** A proxied url of footer icon */
   proxy_icon_url?: string;
}


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure */
export interface DiscordEmbedField {
   /** Name of the field */
   name: string;
   /** Value of the field */
   value: string;
   /** Whether or not this field should display inline */
   inline?: boolean;
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure */
export interface DiscordEmbedAuthor {
   /** Name of author */
   name: string;
   /** Url of author */
   url?: string;
   /** Url of author icon (only supports http(s) and attachments) */
   icon_url?: string;
   /** A proxied url of author icon */
   proxy_icon_url?: string;
}
