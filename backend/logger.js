// logger.js
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json() // Zorgt voor gestructureerde JSON-uitvoer
  ),
  transports: [
    new transports.Console()
  ],
});

export default logger;
