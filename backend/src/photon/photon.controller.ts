import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PhotonService } from './photon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('photon')
export class PhotonController {
  constructor(private readonly photonService: PhotonService) {}

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string) {
    if (!query || query.trim().length < 3) return [];
    return this.photonService.searchAddress(query);
  }
}