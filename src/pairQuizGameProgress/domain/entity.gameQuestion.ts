// import { Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
// import { Question } from "../../question/domain/entity.question";

// @Entity()
// export class GameQuestion {
// 	@PrimaryGeneratedColumn('uuid')
// 	id: string

// 	@ManyToOne(() => PairQuizGameProgress, p => p.gameQuestion)
// 	progress: PairQuizGameProgress

// 	@OneToMany(() => Question, q => q.questionGame)
// 	question: Question
// }