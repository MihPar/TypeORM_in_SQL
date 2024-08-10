import { LikeForComment } from './../../likes/entity/likesForComment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBanViewType, UserViewType } from '../user.type';
import { Device } from '../../security-devices/entities/security-device.entity';
import { LikeForPost } from '../../likes/entity/likesForPost.entity';
import { Blogs } from '../../blogs/entity/blogs.entity';
import { Posts } from '../../posts/entity/entity.posts';
import { Comments } from '../../comment/entity/comment.entity';
import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { BanStatus } from '../enum';
import { UserBlogger } from '../../blogger/entity/entity.userBlogger';
import { Wallpaper } from '../../blogs/entity/wallpaper.entity';
import { Main } from '../../blogs/entity/main.entity';
import { Telegram } from 'telegraf';
import { Telegramm } from '../../telegramm/entity/telegram.entity';
import { Subscribe } from '../../blogs/entity/subscribe.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  passwordHash: string;

  @Column()
  expirationDate: Date;

  @Column()
  confirmationCode: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Column()
  isConfirmed: boolean = false;

  @Column({ default: false })
  isBanned: boolean

  @Column({default: null})
  banReason: string

  @Column({default: null})
  banDate: string

  @Column({default: BanStatus.all})
  banStatus: BanStatus

  @OneToMany(() => Blogs, (b) => b.user)
  blog: Blogs;

  @Column({default: null})
  blogId: string

  @OneToMany(() => Posts, (p) => p.user)
  post: Posts;

  @OneToMany(() => Comments, (c) => c.user)
  comment: Comments;

  @OneToMany(() => LikeForPost, (lfp) => lfp.user)
  likeForPost: LikeForPost;

  @OneToMany(() => Device, (d) => d.user, { onDelete: 'CASCADE' })
  device: Device[];

  @OneToMany(() => LikeForComment, (c) => c.user)
  likeForComment: LikeForComment;

  @Column({ nullable: true, default: 'None' })
  LikeForComment: string;

  @OneToMany(() => PairQuizGameProgressPlayer, (pqg) => pqg.user)
  progressPlayer: PairQuizGameProgressPlayer[];

  @OneToMany(() => UserBlogger, u => u.user)
  userBlogger: UserBlogger

  @OneToMany(() => Wallpaper, i => i.user)
  wallpaper: Wallpaper[]

  @Column({nullable: true})
  wallpaperId: string

  @OneToMany(() => Main, i => i.user)
  main: Main[]

  @Column({nullable: true})
  mainId: string

  @OneToMany(() => Telegramm, t => t.user)
  telegramm: Telegramm[]

  @Column({nullable: true})
  telegrammId: string

  @OneToMany(() => Subscribe, s => s.user)
  subscribe: Subscribe[]

//   @Column({nullable: true})
//   subscribeId: string

  static getViewUser(user: User): UserBanViewType {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
	  banInfo: {
		isBanned: user.isBanned,
		banDate: user.banDate,
		banReason: user.banReason
	  }
    };
  }
}
