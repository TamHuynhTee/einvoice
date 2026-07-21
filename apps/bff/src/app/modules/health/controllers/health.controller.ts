import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @HealthCheck()
  checkLive() {
    return this.healthService.checkMemoryHeap();
  }

  @Get('readiness')
  @HealthCheck()
  checkReady() {
    return this.healthService.checkReadiness();
  }

  @Get('startup')
  @HealthCheck()
  checkStartup() {
    return this.healthService.checkStartup();
  }
}
