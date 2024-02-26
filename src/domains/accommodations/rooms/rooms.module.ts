import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  providers: [RoomsService],
  exports: [RoomsService],
  controllers: [RoomsController],
  imports: [ReservationsModule],
})
export class RoomsModule {}
