import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { PairQuizGameService } from '../application/pair-quiz-game.service';
import { CreatePairQuizGameDto } from '../dto/create-pair-quiz-game.dto';
import { UpdatePairQuizGameDto } from '../dto/update-pair-quiz-game.dto';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';

@Controller('pair-quiz-game/pairs')
export class PairQuizGameController {
  constructor(
	private readonly pairQuizGameService: PairQuizGameService,
	protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Get('my-current')
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(
	@UserIdDecorator() userId: string,
  ) {
    const getCurrentUnFindshedGameOfUser = await this.pairQuezGameQueryRepository.getCurrentUnFinGame()
	return getCurrentUnFindshedGameOfUser
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pairQuizGameService.findOne(+id);
  }

  @Post()
  create(@Body() createPairQuizGameDto: CreatePairQuizGameDto) {
    return this.pairQuizGameService.create(createPairQuizGameDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePairQuizGameDto: UpdatePairQuizGameDto) {
    return this.pairQuizGameService.update(+id, updatePairQuizGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pairQuizGameService.remove(+id);
  }
}
