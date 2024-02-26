import { Module } from '@nestjs/common';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { AccountsModule } from './accounts/accounts.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [AccountsModule, AccommodationsModule, ReviewsModule],
})
export class DomainsModule {}
