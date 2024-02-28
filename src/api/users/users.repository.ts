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

//   async passwordRecovery(id: any, recoveryCode: string): Promise<boolean> {
//     const recoveryInfo = {
//       recoveryCode,
//       expirationDate: add(new Date(), { minutes: 5 }),
//     };
//     const query = `
// 		UPDATE public."Users"
// 				SET 
// 					"expirationDate"='${recoveryInfo.expirationDate}', 
// 					"confirmationCode"='${recoveryInfo.recoveryCode}'
// 			WHERE "id" = $1
// 			RETURNING *
// 	`;
//     const updateRes = await this.dataSource.query(query, [id]);
//     if (!updateRes) return false;
//     return true;
//   }

//   async updatePassword(id: any, newPasswordHash: string) {
//     const query = `
// 		UPDATE public."Users"
// 			SET "passswordHash"= $1
// 			WHERE "id" = $2
// 			RETURNING *
// `;
//     const updatePassword = await this.dataSource.query(query, [
//       newPasswordHash,
//       id,
//     ]);
//     if (!updatePassword) return false;
//     return true;
//   }

//   async updateConfirmation(id: string) {
//     const result = await this.dataSource.query(
//       `
// 		UPDATE public."Users"
// 			SET "isConfirmed"=true
// 			WHERE "id" = $1
// 	`,
//       [id]
//     );
//     return true;
//   }

  async createUser(newUser: User) {
	const insertUser = await this.repository
		.createQueryBuilder("u")
		.insert()
		.into("user u")
		.values([
			{
				userName: newUser.login, 
				email: newUser.email, 
				passportHash: newUser.passwortdHash,
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

//   async updateUserConfirmation(
//     id: string,
//     confirmationCode: string,
//     newExpirationDate: Date
//   ): Promise<boolean> {
//     const query = `
// 		UPDATE public."Users"
// 			SET "expirationDate"=$1, "confirmationCode"=$2
// 			WHERE "id" = $3
// 	`;
//     const result = await this.dataSource.query(query, [
//       newExpirationDate,
//       confirmationCode,
//       id,
//     ]);
//     if (!result) return false;
//     return true;
//   }

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

//   async deleteAllUsers() {
//     await this.dataSource.query(`
// 		DELETE FROM public."Users"
// 	`);
//     return true;
//   }
}
