// deno-lint-ignore-file no-explicit-any
import { parse } from "https://deno.land/x/xml@4.0.0/mod.ts";
import logger from "./logger.service.ts";

/** Obtén o último elemento dun feed de RSS e quédase cos datos máis relevantes. */
export async function getFeedData(rssURL: string, feedType: "rss" | "youtube"): Promise<undefined | any> {
   try {
      const response = await fetch(rssURL);
      // If the URL returns error, throw error and continue.
      if (response.status !== 200) {
         throw response.statusText;
      }
      const xml = await response.text();
      const json = parse(xml) as any;
      if (feedType == "rss" && json.rss && json.rss.channel) {
         return json.rss.channel;
      } else if (json.feed) {
         return json.feed;
      } else {
         throw json;
      }
   } catch (error) {
      logger.warn(`No valid RSS feed for ${rssURL}`);
      logger.warn(error);
      return undefined;
   }
}
/** Fai unha consulta a por un JSON e o devolve parseado. */
export async function fetchJsonData(url: string) {
   const response = await fetch(url);
   return await response.json();
}

/**
 * Chunks an array into smaller arrays of a specified size
 * @param {Array} arr - The array to be chunked
 * @param {number} size - The size of each chunk
 * @returns {Array} - An array of smaller arrays (chunks)
 */
export function splitInChunks(arr: any[], size: number) {
   return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}
