// src/metrics/interfaces/metrics.interfaces.ts

// One measurement in the heartrate time series
export interface HeartrateMeasurement {
  rate: number;
  time: number; // in ms
  hrv: number;  // in ms
}

// Trends for heartrate: two averages
export interface HeartrateTrends {
  hrv: {
    average: number;
  };
  rate: {
    average: number;
  };
}

// Heartrate metric block
export interface HeartrateMetric {
  description: string;
  errors: any[];
  units: {
    time: string | null;
    hrv: string | null;
    rate: string | null;
    [key: string]: string | null;
  };
  measurements: HeartrateMeasurement[];
  trends: HeartrateTrends;
}

// Root of the JSON file
export interface MetricsFile {
  version: string;
  created: string;
  heartrate: HeartrateMetric;

  // For now we don’t strictly type these.
  // We know they exist, but we let TypeScript chill.
  gIndex: any;
  brainPulsatility: any;
}
