// Cloudflare R2 adapter using S3-compatible API
// Language: English (per project preference)

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class R2Adapter {
  private client: S3Client;
  private bucket: string;
  private publicBaseUrl?: string;
  private keyPrefix?: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID || '';
    const endpointEnv = process.env.R2_ENDPOINT || '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    const bucket = process.env.R2_BUCKET || '';
    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || '';
    const keyPrefix = process.env.R2_KEY_PREFIX || '';

    const endpoint = endpointEnv || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');

    this.bucket = bucket;
    this.publicBaseUrl = publicBaseUrl || undefined;
    this.keyPrefix = keyPrefix || undefined;

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(file: Blob | File, fileName?: string): Promise<{ success: boolean; url?: string; errorMessage?: string }> {
    try {
      const name = fileName || (file as any).name || 'upload';
      const ext = name.includes('.') ? name.split('.').pop() : undefined;
      const safeBase = name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
      const key = `${this.keyPrefix ? this.keyPrefix.replace(/\/$/, '') + '/' : ''}${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${safeBase}${ext ? `.${ext}` : ''}`;

      const arrayBuffer = await file.arrayBuffer();
      const body = Buffer.from(arrayBuffer);
      const contentType = (file as any).type || 'application/octet-stream';

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );

      const url = this.publicBaseUrl ? `${this.publicBaseUrl.replace(/\/$/, '')}/${key}` : undefined;
      return { success: true, url };
    } catch (err: any) {
      return { success: false, errorMessage: err?.message || 'R2 upload failed' };
    }
  }
}

export default R2Adapter;
