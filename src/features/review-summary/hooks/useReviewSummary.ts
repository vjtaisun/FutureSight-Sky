import { useState } from 'react';
import { ApiError } from '@/lib/http';
import { summarizeReviewsCsv, summarizeReviewsUrl } from '@/features/review-summary/api/summarizeReviews';
import type { ReviewSummaryApiResponse } from '@/features/review-summary/types/reviewSummary';

interface UseReviewSummaryResult {
  isLoading: boolean;
  error: string | null;
  result: ReviewSummaryApiResponse | null;
  submitFile: (file: File) => Promise<void>;
  submitUrl: (url: string) => Promise<void>;
  clearResult: () => void;
}

export function useReviewSummary(): UseReviewSummaryResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewSummaryApiResponse | null>(null);

  const submitFile = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const summary = await summarizeReviewsCsv(file);
      setResult(summary);
    } catch (unknownError) {
      if (unknownError instanceof ApiError) {
        setError(unknownError.message);
      } else {
        setError('Something went wrong while processing your CSV.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitUrl = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const summary = await summarizeReviewsUrl(url);
      setResult(summary);
    } catch (unknownError) {
      if (unknownError instanceof ApiError) {
        setError(unknownError.message);
      } else {
        setError('Something went wrong while processing the URL.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    result,
    submitFile,
    submitUrl,
    clearResult: () => setResult(null)
  };
}
