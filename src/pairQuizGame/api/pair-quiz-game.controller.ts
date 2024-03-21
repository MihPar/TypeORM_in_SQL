import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PairQuizGameService } from '../application/pair-quiz-game.service';
import { CreatePairQuizGameDto } from '../dto/create-pair-quiz-game.dto';
import { UpdatePairQuizGameDto } from '../dto/update-pair-quiz-game.dto';

@Controller('pair-quiz-game')
export class PairQuizGameController {
  constructor(private readonly pairQuizGameService: PairQuizGameService) {}

  @Post()
  create(@Body() createPairQuizGameDto: CreatePairQuizGameDto) {
    return this.pairQuizGameService.create(createPairQuizGameDto);
  }

  @Get()
  findAll() {
    return this.pairQuizGameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pairQuizGameService.findOne(+id);
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
