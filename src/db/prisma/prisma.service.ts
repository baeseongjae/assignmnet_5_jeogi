import { fakerKO } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Room, User } from '@prisma/client';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import day from 'src/utils/day';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    this.setMiddlewares();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  setMiddlewares() {
    this.$use(async (params, next) => {
      const model = params.model;
      const action = params.action;
      const result = await next(params); //room(create)를 받는다.

      if (model === 'User' && action === 'create') {
        const user = result as User;

        await this.userProfile.create({
          data: {
            userId: user.id,
            nickname: fakerKO.internet.displayName(),
          },
        });
      }

      if (model === 'Room' && action === 'create') {
        // if (model === 'Accommodation' && action === 'findMany') {
        const room = result as Room;

        const today = day().startOf('day');
        const endDate = dayjs('2024-03-31');
        const diffInDay = endDate.diff(today, 'day') + 1;

        //결과 38을 배열로 만들기
        const promises = Array(diffInDay)
          .fill(0)
          .map((_, index) => {
            const date = today.add(index, 'day').toDate();

            return this.reservation.create({
              data: { id: nanoid(), date, roomId: room.id },
            });
          });

        await Promise.all(promises);

        //예약 생성해 주기
      }

      return result;
    });
  }
}

// extends() {
//   const extendedPrismaClient = PrismaClient.$extends({
//     query: {
//       user: {
//         async create({ args, query }) {
//           args.data = {
//             ...args.data,
//             profile: {
//               create: {
//                 nickname: faker.internet.displayName(),
//               },
//             },
//           };

//           return query(args);
//         },
//       },
//       accommodation: {
//         async findMany({ model, operation, args, query }) {
//           // 룸 생성할 때, 룸에 대한 예약을 3월 31일까지 미리 다 생성해 놓으려고

//           const room = [] || (await query(args));
//           const endDate = dayjs('2024-03-31');
//           const startDate = dayjs();

//           const diff = endDate.diff(startDate, 'date');
//           console.log(diff);

//           // 이 사이에서 예약들 쭉쭉 만들어내기
//           // => 오늘 날짜 파악후,
//           //  3월 31일까지를 배열로 만들어서 돌리기.
//           return room;
//         },
//       },
//     },
//   });
// }
