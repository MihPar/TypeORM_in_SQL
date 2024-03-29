// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { PairQuizGameProgressFirstPlayer } from "./entity.pairQuizGameProgressFirstPlayer";

// @Entity()
// export class AnswersFirstPlayer {
// 	@PrimaryGeneratedColumn()
// 	id: string

// 	@ManyToOne(() => PairQuizGameProgressFirstPlayer, p => p.answers)
// 	progress: PairQuizGameProgressFirstPlayer

// 	@Column({nullable: true})
// 	answers: string[]
// }