import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Question } from '../domain/entity.question';
import { QuestionRepository } from '../infrastructury/questionRepository';

export class CreateQuestionCommand {
  constructor(public body: string, public correctAnswers: string[]) {}
}

@CommandHandler(CreateQuestionCommand)
export class classCreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(protected readonly questionRepository: QuestionRepository) {}

  async execute(command: CreateQuestionCommand): Promise<any> {
	const createDate = new Date()
    const question = new Question();
    question.body = command.body;
    question.correctAnswers = command.correctAnswers;
    question.published = false;
	question.createdAt = createDate

    const createQuest: Question = await this.questionRepository.createQuestion(
      question,
    );
	if(!createQuest) return null
    return Question.createQuestion(createQuest)
  }
}
