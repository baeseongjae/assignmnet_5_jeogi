import { Controller, Param, Post } from '@nestjs/common';
import { Private } from 'src/decorators/private.decorator';
import { ReservationsService } from './reservations.service';

@Controller('accommodations/:accommodationId/rooms/:roomId/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':reservationId/check-in')
  @Private('partner')
  async checkInReservation(@Param('reservationId') reservationId: string) {
    console.log(reservationId);
    return this.reservationsService.checkInReservation(reservationId);
  }

  @Post(':reservationId/cancel')
  async cancelReservation(@Param('reservationId') reservationId: string) {
    return this.reservationsService.cancelReservation(reservationId);
  }
}
