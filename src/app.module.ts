import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [MetricsModule, AnalysisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
