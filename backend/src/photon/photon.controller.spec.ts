import { Test, TestingModule } from '@nestjs/testing';
import { PhotonController } from './photon.controller';
import { PhotonService } from './photon.service';

describe('PhotonController', () => {
  let controller: PhotonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotonController],
      providers: [PhotonService],
    }).compile();

    controller = module.get<PhotonController>(PhotonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
