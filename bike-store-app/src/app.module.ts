import { Module } from '@nestjs/common';
import { BikesModule } from './bikes/bikes.module';

@Module({
  imports: [BikesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
