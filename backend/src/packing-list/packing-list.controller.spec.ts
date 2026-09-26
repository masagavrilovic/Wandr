import { Test, TestingModule } from '@nestjs/testing';
import { PackingListController } from './packing-list.controller';
import { PackingListService } from './packing-list.service';

describe('PackingListController', () => {
  let controller: PackingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackingListController],
      providers: [PackingListService],
    }).compile();

    controller = module.get<PackingListController>(PackingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
