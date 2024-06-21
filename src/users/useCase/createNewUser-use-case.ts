import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserBanViewType, UserViewType } from '../user.type';
import { EmailDto, InputModelClassCreateBody, LoginDto, PasswordDto } from '../user.class';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../users.repository';
import { GenerateHashAdapter } from '../../auth/adapter/generateHashAdapter';
import { User } from '../entities/user.entity';
import { EmailManager } from '../../auth/adapter/email.manager';

export class CreateNewUserCommand {
  constructor(
	public loginDto: LoginDto,
	public passwordDto: PasswordDto,
	public emailDto: EmailDto,
	// public body: InputModelClassCreateBody
) {}
}

@CommandHandler(CreateNewUserCommand)
export class CreateNewUserUseCase implements ICommandHandler<CreateNewUserCommand> {
  constructor(
    protected readonly generateHashAdapter: GenerateHashAdapter,
    protected readonly usersRepository: UsersRepository,
    protected readonly emailManager: EmailManager,
  ) {}
  async execute(command: CreateNewUserCommand): Promise<UserBanViewType | null> {
    const passwordHash = await this.generateHashAdapter._generateHash(
      command.passwordDto.password
    );
    const newUser = new User()
	
    newUser.login = command.loginDto.login
    newUser.email = command.emailDto.email
	newUser.createdAt = new Date()
	newUser.passwordHash = passwordHash,
	newUser.expirationDate = add(new Date(), {hours: 1, minutes: 10})
	newUser.confirmationCode = uuidv4()
	newUser.isConfirmed = false
	newUser.isBanned = true
	newUser.banDate = new Date().toISOString()
	newUser.banReason = null

    const user: any = await this.usersRepository.createUser(newUser);
	
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        newUser.email,
        newUser.confirmationCode
      );
    } catch (error) {
      console.log(error, "error with send mail");
    }
    return User.getViewUser(user);
  }
}
