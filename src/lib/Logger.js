import { createLogger, config, transports, format } from 'winston';

import loggerConfig from '../config/logger';
import uuidHelper from '../app/helpers/uuid';

const { combine, timestamp, label, printf } = format;

const Logger = createLogger({
  level: config.syslog.levels,
  format: combine(
    label({ label: uuidHelper.generate() }),
    timestamp(),
    printf(({ level, message, label: uuid, timestamp: currentTimestamp }) => {
      return `${currentTimestamp} [${uuid}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.File(loggerConfig.file),
    new transports.Console(loggerConfig.console),
  ],
});

export default Logger;
