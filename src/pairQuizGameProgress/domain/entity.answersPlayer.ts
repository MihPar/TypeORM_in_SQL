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

  @ManyToOne(() => Question, (q) => q.answersPlayer)
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
	// console.log(JSON.stringify(answer))
    return {
      questionId: answer.questionId,
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt,
    };
  }

//   {"id":"8c2c8b95-2ebc-469a-af10-999d6f4d6ca7","progressId":"383d1d19-48ab-4e27-85cd-a67090b71923","questionId":"c7764a46-0271-4900-9866-ede63492fb74","answer":"Mickle","answerStatus":"Correct","addedAt":"2024-05-03T10:57:39.114Z","progress":{"id":"383d1d19-48ab-4e27-85cd-a67090b71923","gameId":"a1fde5aa-826d-47f0-a484-9226909f8989","userId":"5d8f621e-c1fe-42fa-ac92-c6cf9018fd9d","questionId":"c7764a46-0271-4900-9866-ede63492fb74","addedAt":"2024-05-03T10:57:39.114Z","answerStatus":"Correct","score":1,"bonus_score":0}}

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