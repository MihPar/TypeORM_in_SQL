import { BadRequestException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { User } from "src/api/users/entities/user.entity";

@ValidatorConstraint({ name: "code", async: true })
@Injectable()
export class CustomCodeValidation implements ValidatorConstraintInterface {
  constructor(
	protected readonly usersQueryRepository: UsersQueryRepository
	) {}
  async validate(value: string): Promise<boolean> {
    const user: User | null = await this.usersQueryRepository.findUserByConfirmation(value);
    if (user) {
      throw new BadRequestException([{ message: "code already exists", field: "code" }]);
    } if(user!.isConfirmed) {
		throw new BadRequestException([{message: 'Incorrect code!', field: 'code'}])
	} else {
      return true;
    }
  }
}
