import { Transform, TransformFnParams } from "class-transformer";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	IsUUID,
	MinLength,
	IsNumber,
	isBoolean,
	IsBoolean,
} from "class-validator";
import { UserViewType } from "./user.type";

const UUID_VERSION = '4'
const UUID = () => IsUUID(UUID_VERSION)

const Trim = () =>
	Transform(({ value }: TransformFnParams) => {
		return value?.trim();
	});

export class InputModelClassCreateBody {
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(10)
	login: string;

	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@IsNotEmpty()
	password: string;

	@IsEmail()
	@IsString()
	@Trim()
	@IsNotEmpty()
	email: string;
}

export class LoginDto {
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(10)
	login: string;
}

export class PasswordDto {
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@IsNotEmpty()
	password: string;
}

export class EmailDto {
	@IsEmail()
	@IsString()
	@Trim()
	@IsNotEmpty()
	email: string;
}

export class DtoType {
	@IsString()
	@Trim()
	@IsUUID()
	// @IsNumber()
	id: string
}

export class BanInputModel {
	@IsBoolean()
	isBanned: boolean

	@IsString()
	@Trim()
	@MinLength(6)
	@IsNotEmpty()
	banReason: string
}