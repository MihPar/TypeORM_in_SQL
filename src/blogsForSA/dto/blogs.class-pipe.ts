import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString, IsUUID, IsUrl, MaxLength } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";

const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function IsCustomString() {
	return applyDecorators(IsString(), Trim(), IsNotEmpty())
}

  export class BodyBlogsModel {
	@IsString() 
	@Trim() 
	@IsNotEmpty()
	@MaxLength(15)
	name: string

	@IsString() 
	@Trim() 
	@IsNotEmpty()
	@MaxLength(500)
    description: string
	
	@IsUrl()
	@MaxLength(100)
    websiteUrl: string
}

export class inputModelClass {
	@IsString()
	@Trim()
	@IsUUID()
	// @IsNumber()
	blogId: string
}

export class inputModelBlogIdClass {
	@IsString()
	@Trim()
	@IsUUID()
	// @IsNumber()
	id: string
}

export class inputModelUpdataPost {
	@IsString()
	@Trim()
	@IsUUID()
	// @IsNumber()
	blogId: string

	@IsString()
	@Trim()
	@IsUUID()
	// @IsNumber()
	postId: string
}

export class BanBlogInputModel {
	@IsNotEmpty()
	@IsBoolean()
	isBanned: boolean;
  }