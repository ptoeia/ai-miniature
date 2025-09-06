// Provider-agnostic upload service (storage only)
// Language: English (code), discussion Chinese

import { R2Adapter } from '@/lib/upload/providers/R2Adapter';

export type UploadProvider = 'r2';

export interface IUploadService {
  upload(file: Blob | File, opts?: { provider?: UploadProvider; fileName?: string }): Promise<{ success: boolean; url?: string; errorMessage?: string; provider: UploadProvider }>;
}

export class UploadService implements IUploadService {
  async upload(
    file: Blob | File,
    opts: { provider?: UploadProvider; fileName?: string } = {}
  ): Promise<{ success: boolean; url?: string; errorMessage?: string; provider: UploadProvider }> {
    const provider: UploadProvider = opts.provider ?? 'r2';

    switch (provider) {
      case 'r2': {
        const r2 = new R2Adapter();
        const res = await r2.upload(file, opts.fileName);
        return { success: res.success, url: res.url, errorMessage: res.errorMessage, provider };
      }
      default: {
        return { success: false, errorMessage: `Unsupported provider: ${provider}`, provider } as any;
      }
    }
  }
}

export default UploadService;
