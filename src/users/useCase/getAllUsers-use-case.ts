import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../users.repository';
import { PaginationType } from '../../types/pagination.types';
import { UserBanViewType } from '../user.type';


export class GetAllUsersCommand {
  constructor(
    public searchLoginTerm: string | null,
    public searchEmailTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: string,
    public pageNumber: string,
  ) {}
}
@CommandHandler(GetAllUsersCommand)
export class GetAllUsersUseCase implements ICommandHandler<GetAllUsersCommand> {
  constructor(
    protected readonly usersRepository: UsersRepository
  ) {}

  async execute(command: GetAllUsersCommand): Promise<PaginationType<UserBanViewType>> {
    return await this.usersRepository.findAllUsers(
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
