import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";
import { PairQuizGameProgressPlayer } from "./entity.pairQuizGameProgressPlayer";
import { AnswerType } from "../../pairQuizGame/type/typeViewModel";
import { log } from "console";

@Entity()
export class AnswersPlayer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => PairQuizGameProgressPlayer, (p) => p.answers)
  progress: PairQuizGameProgressPlayer;

  @Column()
  progressId: string;

  @ManyToOne(() => Question, (p) => p.answersPlayer)
  question: Question;

  @Column({nullable: true})
  questionId: string;

  @Column({ nullable: true })
  answer: string;

  @Column({ nullable: false })
  answerStatus: AnswerStatusEnum;

  @Column()
  addedAt: Date;

  static getViewModelForGame(answer: AnswersPlayer): AnswerType {
	console.log(JSON.stringify(answer))
    return {
      questionId: answer.question.id,
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt,
    };
  }

  static createAnswer(
    questionId: string,
    answerStatus: AnswerStatusEnum,
    answer: string,
    // progressId: string,
    progress: PairQuizGameProgressPlayer,
  ) {
	const newAnswer = new this();
	newAnswer.progressId = progress.id
	newAnswer.questionId = questionId
	newAnswer.answer = answer
	newAnswer.answerStatus = answerStatus
	newAnswer.addedAt = new Date()
	newAnswer.progress = progress

	return newAnswer;
  }
}