import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  // List available metrics (names, units, trends)
  @Get()
  getAvailableMetrics() {
    return this.metricsService.getAvailableMetrics();
  }

  // Heartrate full data
  @Get('heartrate')
  getHeartrate() {
    return this.metricsService.getHeartrate();
  }

  // gIndex full data
  @Get('gindex')
  getGIndex() {
    return this.metricsService.getGIndex();
  }

  // Brain pulsatility full data
  @Get('brain-pulsatility')
  getBrainPulsatility() {
    return this.metricsService.getBrainPulsatility();
  }
}
