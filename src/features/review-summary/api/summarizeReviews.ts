import { config } from '@/lib/config';
import { parseJson } from '@/lib/http';
import type {
  ReviewScrapeSummaryResponse,
  ReviewSummaryResponse
} from '@/features/review-summary/types/reviewSummary';

const SUMMARIZE_PATH = '/api/v1/reviews/summarize';
const SCRAPE_SUMMARIZE_PATH = '/api/v1/reviews/scrape-summarize';

export async function summarizeReviewsCsv(file: File): Promise<ReviewSummaryResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${config.apiBaseUrl}${SUMMARIZE_PATH}`, {
    method: 'POST',
    body: formData
  });

  return parseJson<ReviewScrapeSummaryResponse>(response);
}

export async function summarizeReviewsUrl(url: string): Promise<ReviewScrapeSummaryResponse> {
  const response = await fetch(`${config.apiBaseUrl}${SCRAPE_SUMMARIZE_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  return parseJson<ReviewSummaryResponse>(response);
}
