import { ILoggerService } from '@shared/typings/logger.types';
import { ClientSession, Connection } from 'mongoose';

export class UnitOfWork {
  private className: string;
  public constructor(
    private connection: Connection,
    private logger: ILoggerService,
  ) {
    this.className = this.constructor.name;
  }

  public async startSession(): Promise<ClientSession> {
    return this.connection.startSession();
  }

  public async commit(session: ClientSession, closeSessionAfterCommitting: boolean = true): Promise<void> {
    if (!session.hasEnded && closeSessionAfterCommitting) {
      await session.commitTransaction();
    }

    if (closeSessionAfterCommitting) {
      session.endSession();
    }
  }

  public async rollback(session: ClientSession): Promise<void> {
    if (session.transaction?.isActive) {
      await session.abortTransaction();
    }
    session.endSession();
  }

  public async withTransaction<T = void>(
    session: ClientSession,
    callback: () => Promise<T>,
    closeSessionAfterCommitting: boolean = false,
  ): Promise<T> {
    const context = `${this.className}.withTransaction`;
    try {
      if (!session) return callback();

      const transactionAlreadyStarted = session.inTransaction();
      if (!transactionAlreadyStarted) session.startTransaction();
      const result = await callback();
      await this.commit(session, closeSessionAfterCommitting);
      return result;
    } catch (error) {
      this.logger.error({ context, message: 'trasaction_error', errors: [error] });
      await this.rollback(session);
      throw error;
    }
  }
}
