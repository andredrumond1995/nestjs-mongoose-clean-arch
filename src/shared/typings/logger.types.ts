import { AppNamesEnum } from "@shared/enums/app-names.enums";
import { LoggerLevelsEnum } from "@shared/enums/logger.enums";

export interface ILoggerService {
  error(message: string | ILoggerMessage): void;
  info(message: string | ILoggerMessage): void;
  warn(message: string | ILoggerMessage): void;
  debug(message: string | ILoggerMessage): void;
  verbose(message: string | ILoggerMessage): void;
}

export interface ILoggerMessage {
  context: string;
  app?: AppNamesEnum;
  message?: string;
  event?: string;
  level?: LoggerLevelsEnum;
  errors?: any;
  data?: any;
  timestamp?: string;
}
