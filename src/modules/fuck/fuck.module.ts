import { Module } from '@nestjs/common';
import { FuckService } from './fuck.service';
import { FuckController } from './fuck.controller';
import { FuckEntity } from 'src/modules/fuck/entities/fuck.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FuckEntity])],
  controllers: [FuckController],
  providers: [FuckService],
})
export class FuckModule {}
