import { Body, Controller, Param, Post } from '@nestjs/common';
import { Private } from 'src/decorators/private.decorator';
import { ReviewCreationDto } from './reviews.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':reservationId')
  @Private('user')
  async createReview(
    @Param('reservationId') reservationId: string,
    @Body() reviewCreationDto: ReviewCreationDto,
  ) {
    return this.reviewsService.createReview(reservationId, reviewCreationDto);
  }
}
