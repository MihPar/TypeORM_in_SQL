import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../users.repository';
import { User } from '../entities/user.entity';
import { UserBanViewType } from '../user.type';
import { PaginationType } from '../../types/pagination.types';

export class GetBannedUsersCommand {
  constructor(
    public banStatus: string,
    public searchLoginTerm: string | null,
    public searchEmailTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: string,
    public pageNumber: string,
  ) {}
}
@CommandHandler(GetBannedUsersCommand)
export class GetBannedUsersUseCase
  implements ICommandHandler<GetBannedUsersCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
  ) {}

  async execute(command: GetBannedUsersCommand): Promise<PaginationType<UserBanViewType>> {
    // console.log(command.banStatus, 'status use case not all');
    let banStatus = true;

    if (command.banStatus === 'notBanned') {
      banStatus = false;
    } else if (command.banStatus === 'banned') {
      banStatus = true;
    }
    return await this.usersRepository.findBannedUsers(
      banStatus,
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
