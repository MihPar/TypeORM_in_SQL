import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../users.queryRepository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepository } from '../users.repository';
import { emailInputDataClass } from '../../auth/dto/auth.class.pipe';
import { EmailManager } from '../../auth/adapter/email.manager';
import { User } from '../entities/user.entity';

export class RegistrationEmailResendingCommand {
  constructor(public inputDateReqEmailResending: emailInputDataClass) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly usersRepository: UsersRepository,
    protected readonly emailManager: EmailManager,
  ) {}
  async execute(command: RegistrationEmailResendingCommand): Promise<any> {
    const user: User | null =
      await this.usersQueryRepository.findUserByEmail(
        command.inputDateReqEmailResending.email,
      );
    if (!user) return false;
    if (user.isConfirmed) {
      return false;
    }
    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 10,
    });
    await this.usersRepository.updateUserConfirmation(
      user!.id,
      newConfirmationCode,
      newExpirationDate,
    );
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.email,
        newConfirmationCode,
      );
    } catch (error) {
      console.log('code resending email error', error);
    }
    return true;
  }
}
