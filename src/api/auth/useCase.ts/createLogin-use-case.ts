import bcrypt  from 'bcrypt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../../api/users/users.queryRepository";
import { InputDataModelClassAuth } from '../dto/auth.class.pipe';
import { v4 as uuidv4 } from 'uuid'; 
import { User } from '../../users/entities/user.entity';

export class CreateLoginCommand {
	constructor(
		public inutDataModel: InputDataModelClassAuth,
	) {}
}

@CommandHandler(CreateLoginCommand)
export class CreateLoginUseCase implements ICommandHandler<CreateLoginCommand> {
  constructor(protected readonly usersQueryRepository: UsersQueryRepository) {}
  async execute(command: CreateLoginCommand): Promise<User | null> {
    try {
      const user: User | null =
        await this.usersQueryRepository.findByLoginOrEmail(
          command.inutDataModel.loginOrEmail
        );
      if (!user) return null;
      const resultBcryptCompare: boolean = await bcrypt.compare(
        command.inutDataModel.password, user!.passwordHash
		);
      if (resultBcryptCompare !== true) return null;
      return user;
    } catch (error) {
      console.log("EWUIWERUWEIRWEURIWEURWEIRUWERIWEUEWIRUERIWURWEIRU: ", error);
    }
    return null;
  }
}


