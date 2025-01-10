// logger.js
import { createLogger, format, transports } from 'winston';
import expressWinston from 'express-winston';

const { combine, timestamp, json, printf } = format;

// Custom log format (optioneel, voor meer flexibiliteit in de logs)
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` | Metadata: ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json(), // Zorgt voor gestructureerde JSON-uitvoer
    // customFormat // Gebruik indien nodig een aangepaste formattering
  ),
  defaultMeta: { serviceName: 'backend-service' }, // Voeg standaard metadata toe
  transports: [
    new transports.Console(), // Console-output
    ...(process.env.NODE_ENV === 'production'
      ? [new transports.File({ filename: 'application.log' })] // Log naar bestand in productie
      : []),
  ],
});

// Middleware voor automatisch HTTP-verkeer loggen in Express
export const httpLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true, // Log HTTP metagegevens zoals method en status
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}}ms',
  expressFormat: true,
  colorize: false,
});

// Middleware voor foutafhandeling loggen in Express
export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

// Voorbeeld van gebruik
logger.info('Logger initialized');

// Export de logger
export default logger;
