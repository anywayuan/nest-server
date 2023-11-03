import { Test, TestingModule } from '@nestjs/testing';
import { FuckService } from './fuck.service';

describe('FuckService', () => {
  let service: FuckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuckService],
    }).compile();

    service = module.get<FuckService>(FuckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
