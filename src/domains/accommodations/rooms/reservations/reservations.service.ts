import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkInReservation(reservationId: string) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) throw new NotFoundException('There is no reservation');
    if (!reservation.reservedById || reservation.checkedInAt) {
      throw new NotFoundException('Reservation cannot be checked in');
    }

    const checkedInAt = new Date();
    const updatedReservation = await this.prismaService.reservation.update({
      where: { id: reservationId },
      data: { checkedInAt },
    });

    return updatedReservation;
  }

  async cancelReservation(reservationId: string) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) throw new NotFoundException('Reservation not found');

    if (reservation.checkedInAt) {
      throw new NotFoundException('Reservation has already been checked in');
    }

    const updatedReservation = await this.prismaService.reservation.update({
      where: { id: reservationId },
      data: { reservedAt: null, reservedById: null },
    });

    return updatedReservation;
  }
}
