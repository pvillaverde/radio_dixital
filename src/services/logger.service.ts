import { Logger } from "npm:tslog";
import LogLevel from "../types/logLevel.ts";
export default new Logger({
   minLevel: LogLevel.Info,
   type: "pretty",
});
