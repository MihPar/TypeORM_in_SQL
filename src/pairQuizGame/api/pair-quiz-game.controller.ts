import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { PairQuizGameService } from '../application/pair-quiz-game.service';
import { CreatePairQuizGameDto } from '../dto/create-pair-quiz-game.dto';
import { UpdatePairQuizGameDto } from '../dto/update-pair-quiz-game.dto';

@Controller('pair-quiz-game/pairs')
export class PairQuizGameController {
  constructor(private readonly pairQuizGameService: PairQuizGameService) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Get('my-current')
  @UseGuards()
  async getCurenctUnFinishedGame() {
    
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
