import { Logger } from "npm:tslog";
import LogLevel from "../types/logLevel.ts";

// Create a mapping of log level strings to LogLevel enum values
const logLevelMap: { [key: string]: LogLevel } = {
   silly: LogLevel.Silly,
   trace: LogLevel.Trace,
   debug: LogLevel.Debug,
   info: LogLevel.Info,
   warn: LogLevel.Warn,
   error: LogLevel.Error,
   fatal: LogLevel.Fatal,
};

// Function to get the log level from the environment variable
function getLogLevelFromEnv(): LogLevel {
   const logLevelString = Deno.env.get("LOG_LEVEL")?.toLowerCase() || "info";
   return logLevelMap[logLevelString] ?? LogLevel.Info;
}

export default new Logger({
   minLevel: getLogLevelFromEnv(),
   type: "pretty",
});