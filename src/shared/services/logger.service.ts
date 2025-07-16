import { LoggerLevelsEnum } from '@shared/enums/logger.enums';
import { ILoggerMessage, ILoggerService } from '@shared/typings/logger.types';
import { formatDatetime } from '@shared/utils/datetime.utils';
export class LoggerService implements ILoggerService {
  private app: string;
  public constructor(appName: string) {
    this.app = appName;
  }

  private formatJson(message: ILoggerMessage, level: LoggerLevelsEnum): string {
    const formattedMessage = {
      ...message,
      app: this.app,
      level,
      timestamp: message.timestamp || formatDatetime({ value: new Date() }),
    };
    return JSON.stringify(formattedMessage); // Single line JSON
  }

  private prepareMessage(message: string | ILoggerMessage, level: LoggerLevelsEnum): string {
    if (typeof message === 'string') {
      return JSON.stringify({
        app: this.app,
        message,
        level,
        timestamp: formatDatetime({ value: new Date() }),
      } as ILoggerMessage);
    }
    return this.formatJson(message, level);
  }

  public error(message: string | ILoggerMessage): void {
    const formattedMessage = this.prepareMessage(message, LoggerLevelsEnum.ERROR);
    // eslint-disable-next-line no-console
    console.error(formattedMessage);
  }

  public info(message: string | ILoggerMessage): void {
    const formattedMessage = this.prepareMessage(message, LoggerLevelsEnum.INFO);
    // eslint-disable-next-line no-console
    console.log(formattedMessage);
  }

  public warn(message: string | ILoggerMessage): void {
    const formattedMessage = this.prepareMessage(message, LoggerLevelsEnum.WARN);
    // eslint-disable-next-line no-console
    console.warn(formattedMessage);
  }

  public debug(message: string | ILoggerMessage): void {
    const formattedMessage = this.prepareMessage(message, LoggerLevelsEnum.DEBUG);
    // eslint-disable-next-line no-console
    console.debug(formattedMessage);
  }

  public verbose(message: string | ILoggerMessage): void {
    const formattedMessage = this.prepareMessage(message, LoggerLevelsEnum.VERBOSE);
    // eslint-disable-next-line no-console
    console.debug(formattedMessage);
  }
}
