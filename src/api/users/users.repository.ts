import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { add } from 'date-fns';
import { UsersQueryRepository } from './users.queryRepository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
	@InjectRepository(User) protected readonly userRepository: Repository<User>,
    protected readonly usersQueryRepository: UsersQueryRepository
  ) {}

  async passwordRecovery(id: any, recoveryCode: string): Promise<boolean> {
    const recoveryInfo = {
      recoveryCode,
      expirationDate: add(new Date(), { minutes: 5 }),
    };

	const recoveryPassword = await this.userRepository
		.createQueryBuilder()
		.update(User)
		.set({
			expirationDate: recoveryInfo.expirationDate,
			confirmationCode: recoveryInfo.recoveryCode
		})
		.where("id = :id", {id})
		.execute()

		if (!recoveryPassword) return false;
    return true;
  }

  async updatePassword(id: any, newPasswordHash: string): Promise<boolean> {
	const updatePassword = await this.userRepository
		.createQueryBuilder()
		.update(User)
		.set({passwordHash: newPasswordHash})
		.where("id = :id", {id})
		.execute()

		if (!updatePassword) return false;
    return true;
  }

  async updateConfirmation(id: number) {
	const result = await this.userRepository
		.createQueryBuilder()
		.update(User)
		.set({isConfirmed: true})
		.where("id = :id", {id})
		.execute()

		return true;
  }

  async createUser(newUser: User) {
	const insertUser = await this.userRepository
		.createQueryBuilder()
		.insert()
		.into(User)
		.values(
			// newUser
			[
			{
				login: newUser.login, 
				email: newUser.email, 
				passwordHash: newUser.passwordHash,
				createdAt: newUser.createdAt,
				confirmationCode: newUser.confirmationCode,
				expirationDate: newUser.expirationDate,
				isConfirmed: newUser.isConfirmed
			}
		]
		)
		.returning("id")
		.execute()
	return insertUser
  }

  async updateUserConfirmation(
    id: number,
    confirmationCode: string,
    newExpirationDate: Date
  ): Promise<boolean> {

	const updateCunfirmation = await this.userRepository
		.createQueryBuilder()
		.update(User)
		.set({
			expirationDate: newExpirationDate,
			confirmationCode: confirmationCode
		})
		.where("id = :id", {id})
		.execute()
    
    if (!updateCunfirmation) return false;
    return true;
  }

  async deleteById(userId: number) {
	const findUserById: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.id = :id", {id: userId})
		.getOne()
	if(!findUserById) return false

	const deleteById = await this.userRepository
		.createQueryBuilder()
		.delete()
		.from(User)
		.where("id = :id", {id: userId})
		.execute()
		
    if (!deleteById) return false;
    return true;
  }

  async deleteAllUsers() {
    await this.userRepository
		.createQueryBuilder()
		.delete()
		.from(User)
		.execute()
    return true;
  }
}
