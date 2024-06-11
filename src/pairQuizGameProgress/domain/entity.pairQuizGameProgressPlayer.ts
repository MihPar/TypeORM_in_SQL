import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AnswersPlayer } from './entity.answersPlayer';
import { Question } from '../../question/domain/entity.question';
import { PairQuizGame } from '../../pairQuizGame/domain/entity.pairQuezGame';

@Entity()
export class PairQuizGameProgressPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PairQuizGame)
  game: PairQuizGame;

  @Column({ nullable: true })
  gameId: string;

  @ManyToOne(() => User, (u) => u.progressPlayer)
  user: User;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => Question, (q) => q.progressPlayer)
  question: Question;

  @Column({ nullable: true })
  questionId: string;

  @Column()
  addedAt: Date;

  @Column({ default: null })
  // @Index()
  userStatus: string;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  bonus_score: number;

  @OneToMany(() => AnswersPlayer, (a) => a.progress)
  answers: AnswersPlayer[];
}
