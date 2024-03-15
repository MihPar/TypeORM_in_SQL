import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../users.repository';

export class DeleteUserByIdCommand {
  constructor(public userId: string) {}
}
@CommandHandler(DeleteUserByIdCommand)
export class DeleteUserByIdUseCase
  implements ICommandHandler<DeleteUserByIdCommand>
{
  constructor(protected readonly usersRepository: UsersRepository) {}
  async execute(command: DeleteUserByIdCommand): Promise<boolean> {
    const isDeletedUser: boolean = await this.usersRepository.deleteById(
      command.userId,
    );
    return isDeletedUser;
  }
}
