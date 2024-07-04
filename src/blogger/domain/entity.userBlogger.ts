import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Blogs } from "../../blogs/entity/blogs.entity";

@Entity()
export class UserBlogger {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@ManyToOne(() => User, ub => ub.userBlogger)
	user: User

	@Column({ nullable: true })
	userId: string

	@ManyToOne(() => Blogs, ub => ub.userBlogger)
	blog: Blogs

	@Column({ nullable: true })
	blogId: string

	@Column()
	banReason: string;

	@Column()
	isBanned: boolean;
	
	@Column()
	banDate: string;
}