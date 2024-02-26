import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { ReviewCreationDto } from './reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReview(
    reservationId: string,
    reviewCreationDto: ReviewCreationDto,
  ) {
    // 예약정보 가져오기.
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id: reservationId },
    });

    // 없으면 돌아가~
    if (!reservation) throw new NotFoundException('There is no reservation ');

    const { rating, content } = reviewCreationDto;
    const reviewData: any = {
      roomId: reservation.roomId,
      rating,
      content,
    };
    if (reservation.reservedById) reviewData.userId = reservation.reservedById;
    // 있다면 리뷰생성
    const review = await this.prismaService.review.create({
      data: reviewData,
    });

    return review;
  }
}
