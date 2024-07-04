import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

export class BanUserForBlogInputModel {
	@IsNotEmpty()
	@IsBoolean()
	isBanned: boolean;
  
	@IsString()
	@IsNotEmpty()
	@Length(20)
	@Transform(({ value }) => value.trim())
	banReason: string;
  
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	blogId: string;
  }
  