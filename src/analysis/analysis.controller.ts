/* eslint-disable */

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
// import { Express } from 'express';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadAndProxy(
//     @UploadedFile() file: Express.Multer.File,
//     @Headers('authorization') authHeader?: string,
//   ) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     const token = authHeader?.startsWith('Bearer ')
//       ? authHeader.slice('Bearer '.length)
//       : undefined;

//     if (!token) {
//       throw new BadRequestException('Missing Firebase token');
//     }

//     const resultJson = await this.analysisService.analyzeFileWithPolling(
//       file,
//       token,
//     );

//     return {
//       status: 'ok',
//       result: resultJson,
//     };
//   }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndProxy(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 1) try to read from header
    let token =
      authHeader?.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : undefined;

    // 2) fallback to env var for manual testing
    if (!token && process.env.ANALYSIS_TEST_TOKEN) {
      token = process.env.ANALYSIS_TEST_TOKEN;
    }

    if (!token) {
      throw new BadRequestException('Missing Firebase token');
    }

    const resultJson = await this.analysisService.analyzeFileWithPolling(
      file,
      token,
    );

    return {
      status: 'ok',
      result: resultJson,
    };
  }

}
