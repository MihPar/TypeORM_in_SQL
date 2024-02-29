import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { add } from 'date-fns';
import { UsersQueryRepository } from './users.queryRepository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
	@InjectRepository(User) protected readonly repository: Repository<User>,
    protected readonly usersQueryRepository: UsersQueryRepository
  ) {}

  async passwordRecovery(id: any, recoveryCode: string): Promise<boolean> {
    const recoveryInfo = {
      recoveryCode,
      expirationDate: add(new Date(), { minutes: 5 }),
    };

	const recoveryPassword = await this.repository
		.createQueryBuilder("u")
		.update("user")
		.set({
			expirationDate: recoveryInfo.expirationDate,
			confirmationCode: recoveryInfo.recoveryCode
		})
		.where("u.id = :id", {id})
		.execute()

		if (!recoveryPassword) return false;
    return true;
  }

  async updatePassword(id: any, newPasswordHash: string): Promise<boolean> {
	const updatePassword = await this.repository
		.createQueryBuilder("u")
		.update("user")
		.set({passwortdHash: newPasswordHash})
		.where("u.id = :id", {id})
		.execute()

		if (!updatePassword) return false;
    return true;
  }

  async updateConfirmation(id: number) {
	const result = await this.repository
		.createQueryBuilder("u")
		.update("user")
		.set({isConfirmed: true})
		.where("u.id = id", {id})
		.execute()

		return true;
  }

  async createUser(newUser: User) {
	const insertUser = await this.repository
		.createQueryBuilder("u")
		.insert()
		.into("user u")
		.values([
			{
				userName: newUser.login, 
				email: newUser.email, 
				passportHash: newUser.passwordHash,
				createdAt: newUser.createdAt,
				confirmationCode: newUser.confirmationCode,
				expirationDate: newUser.expirationDate,
				isConfirmed: newUser.isConfirmed
			}
		])
		.returning("u.id")
		.execute()
	return insertUser
  }

  async updateUserConfirmation(
    id: number,
    confirmationCode: string,
    newExpirationDate: Date
  ): Promise<boolean> {

	const updateCunfirmation = await this.repository
		.createQueryBuilder("u")
		.update("user")
		.set({
			expirationDate: newExpirationDate,
			confirmationCode: confirmationCode
		})
		.where("u.id = :id", {id})
		.execute()
    
    if (!updateCunfirmation) return false;
    return true;
  }

  async deleteById(userId: string) {
	const findUserById: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("user.id = :id", {id: userId})
		.getOne()
	if(!findUserById) return false

	const deleteById = await this.repository
		.createQueryBuilder("u")
		.delete()
		.from("user")
		.where("user.id = :id", {id: userId})
		.execute()
		
    if (!deleteById) return false;
    return true;
  }

  async deleteAllUsers() {
    await this.repository
		.createQueryBuilder("u")
		.delete()
		.from("user")
		.execute()
    return true;
  }
}
