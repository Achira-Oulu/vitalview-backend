// src/analysis/analysis.service.ts
/* eslint-disable */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormDataNode from 'form-data';

const ANALYSIS_API =
  'https://analysis-manager-glymphaticresearch.2.rahtiapp.fi/analysis';

interface PresignResponse {
  url: string;
  fields: Record<string, string>;
}

@Injectable()
export class AnalysisService {
  constructor(private readonly http: HttpService) {}

  async analyzeFileWithPolling(
    file: Express.Multer.File,
    token: string,
    maxRetries = 10,
    delayMs = 3000,
  ): Promise<any> {
    // 1) get presigned URL + fields (Step 1 from Expo code)
    const presign = await this.getAnalysisUploadFields('json', token);
    const key = presign.fields.key;

    // 2) upload the file via presigned POST (Step 2)
    await this.uploadAnalysisFile(file, presign);

    // 3) poll the analysis endpoint (Step 3)
    for (let i = 0; i < maxRetries; i++) {
      const result = await this.fetchAnalysisResult(key, token);

      if (result.url) {
        // 3b) fetch the final JSON
        const data = await this.fetchAnalysisJson(result.url);
        return data;
      }

      if (result.error) {
        throw new InternalServerErrorException(
          `Analysis failed: ${result.error}`,
        );
      }

      // still pending
      await this.sleep(delayMs);
    }

    throw new InternalServerErrorException('Analysis timed out');
  }

  private async getAnalysisUploadFields(
    outputFormat = 'json',
    token?: string,
  ): Promise<PresignResponse> {
    const res = await firstValueFrom(
      this.http.post(
        ANALYSIS_API,
        { outputFormat },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      ),
    );

    return res.data as PresignResponse;
  }

  private async uploadAnalysisFile(
    file: Express.Multer.File,
    presign: PresignResponse,
  ): Promise<void> {
    const { url, fields } = presign;
    const form = new FormDataNode();

    // add all presigned fields
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));

    // add the file
    form.append('file', file.buffer, {
      filename: file.originalname || 'upload.bin',
      contentType: file.mimetype || 'application/octet-stream',
    });

    const res = await firstValueFrom(
      this.http.post(url, form, {
        headers: form.getHeaders(),
        validateStatus: () => true, // let us handle non-2xx
      }),
    );

    if (res.status < 200 || res.status >= 300) {
      throw new InternalServerErrorException(
        `File upload failed: ${res.status} ${res.data}`,
      );
    }
  }

  private async fetchAnalysisResult(key: string, token?: string): Promise<any> {
    const url = `${ANALYSIS_API}/${key}?outputFormat=json`;
    const res = await firstValueFrom(
      this.http.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        validateStatus: () => true,
      }),
    );

    if (res.status === 404) {
      // pending
      return { pending: true };
    }

    if (res.status < 200 || res.status >= 300) {
      throw new InternalServerErrorException(
        `Failed to fetch analysis: ${res.status} ${res.data}`,
      );
    }

    return res.data;
  }

  private async fetchAnalysisJson(resultUrl: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get(resultUrl, {
        responseType: 'json',
        validateStatus: () => true,
      }),
    );

    if (res.status < 200 || res.status >= 300) {
      throw new InternalServerErrorException(
        `Failed to download analysis JSON: ${res.status}`,
      );
    }

    return res.data;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
