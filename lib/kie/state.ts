import type { TaskStatusResponseDTO } from './dto';

// Map vendor/raw state to unified status used by our app
export function mapKieStateToUnified(state?: string): TaskStatusResponseDTO['status'] {
  switch ((state || '').toLowerCase()) {
    case 'success':
    case 'succeeded':
      return 'succeeded';
    case 'processing':
    case 'running':
    case 'in_progress':
      return 'processing';
    case 'queued':
    case 'pending':
      return 'queued';
    case 'timeout':
      return 'timeout';
    case 'canceled':
    case 'cancelled':
      return 'canceled';
    case 'failed':
      return 'failed';
    default:
      // Default to processing unless explicitly failed; keeps UX polling
      return 'processing';
  }
}
