import { Module } from '@nestjs/common';
import { FuckService } from './fuck.service';
import { FuckController } from './fuck.controller';

@Module({
  controllers: [FuckController],
  providers: [FuckService],
})
export class FuckModule {}
