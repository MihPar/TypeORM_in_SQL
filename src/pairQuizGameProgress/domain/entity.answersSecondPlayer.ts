// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { PairQuizGameProgressSecondPlayer } from "./entity.pairQuizGameProgressSecondPlayer";

// @Entity()
// export class AnswersSecondPlayer {
// 	@PrimaryGeneratedColumn()
// 	id: string

// 	@ManyToOne(() => PairQuizGameProgressSecondPlayer, p => p.answers)
// 	progress: PairQuizGameProgressSecondPlayer

// 	@Column({nullable: true})
// 	answers: string[]
// }