import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Accommodation,
  AccommodationType,
  Partner,
  Prisma,
  Room,
} from '@prisma/client';
import * as fs from 'fs/promises';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { RoomsService } from './rooms/rooms.service';

@Injectable()
export class AccommodationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomsService: RoomsService,
  ) {}

  async createAccommodation(data: Prisma.AccommodationUncheckedCreateInput) {
    const accommodation = await this.prismaService.accommodation.create({
      data,
    });

    return accommodation;
  }

  async getAccommodations(type?: AccommodationType) {
    const accommodations = await this.prismaService.accommodation.findMany({
      where: { type },
    });

    return accommodations;
  }

  async getAccommodation(accommodationId: number) {
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId },
      include: { rooms: true },
    });

    return accommodation;
  }

  async addRoomToAccommodation(
    partner: Pick<Partner, 'id'>,
    accommodationId: Accommodation['id'],
    data: Parameters<typeof this.roomsService.createRoom>[1],
  ) {
    // 1. 지금 요청한 파트너가 accommodation의 소유자가 맞는지 확인
    // ㄴ 아니면 돌아가~
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partner.id },
    });
    if (!accommodation) throw new ForbiddenException();
    // 2. 숙소에 방을 추가하기
    const room = await this.roomsService.createRoom(accommodationId, data);

    return room;
  }

  async deleteRoomFromAccommodation(
    partner: Pick<Partner, 'id'>,
    accommodationId: Accommodation['id'],
    roomId: Room['id'],
  ) {
    // 1. 지금 요청한 파트너가 소유자인지 확인
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partner.id },
    });
    if (!accommodation) throw new ForbiddenException();

    // 2. 숙소에서 방 제거
    const room = await this.roomsService.deleteRoom(roomId);
    return room;
  }

  async addImageToAccommodation(file: Express.Multer.File) {
    await fs.writeFile(`./public/${file.originalname}`, file.buffer);
    console.log(file);
  }
}
