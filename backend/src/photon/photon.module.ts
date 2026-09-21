import { Module } from '@nestjs/common';
import { PhotonService } from './photon.service';
import { PhotonController } from './photon.controller';

@Module({
  controllers: [PhotonController],
  providers: [PhotonService],
})
export class PhotonModule {}
