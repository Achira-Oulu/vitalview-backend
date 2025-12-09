import { Injectable } from '@nestjs/common';
import { MetricsFile, HeartrateMetric } from './interfaces/metrics.interfaces';
import rawData from '../data/demo_result.json';

// Cast imported JSON to our typed interface
const metricsFile = rawData as MetricsFile;

@Injectable()
export class MetricsService {
  private readonly heartrate: HeartrateMetric;
  private readonly gIndex: any;
  private readonly brainPulsatility: any;

  constructor() {
    this.heartrate = metricsFile.heartrate;
    this.gIndex = metricsFile.gIndex;
    this.brainPulsatility = metricsFile.brainPulsatility;
  }

  getAvailableMetrics() {
    return [
      {
        name: 'heartrate',
        description: this.heartrate.description,
        units: this.heartrate.units,
        trends: this.heartrate.trends,
      },
      {
        name: 'gIndex',
        description: this.gIndex?.description,
        units: this.gIndex?.units,
        trends: this.gIndex?.trends,
      },
      {
        name: 'brainPulsatility',
        description: this.brainPulsatility?.description,
        units: this.brainPulsatility?.units,
        trends: this.brainPulsatility?.trends,
      },
    ];
  }

  getHeartrate(): HeartrateMetric {
    return this.heartrate;
  }

  getGIndex(): any {
    return this.gIndex;
  }

  getBrainPulsatility(): any {
    return this.brainPulsatility;
  }
}
