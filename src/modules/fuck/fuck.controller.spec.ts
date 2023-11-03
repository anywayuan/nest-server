import { Test, TestingModule } from '@nestjs/testing';
import { FuckController } from './fuck.controller';
import { FuckService } from './fuck.service';

describe('FuckController', () => {
  let controller: FuckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuckController],
      providers: [FuckService],
    }).compile();

    controller = module.get<FuckController>(FuckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
