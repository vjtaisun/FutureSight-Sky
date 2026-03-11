export interface ReviewSummaryStats {
  row_count: number;
  column_count: number;
  sampled_rows: number;
  null_counts: Record<string, number>;
  unique_counts: Record<string, number>;
  column_types: Record<string, string>;
  word_frequencies?: Array<{ word: string; count: number }>;
}

export type ReviewRowValue = string | number | boolean | null;

export interface ReviewPreview {
  columns: string[];
  rows: Array<Record<string, ReviewRowValue>>;
  stats: ReviewSummaryStats;
}

export interface ReviewSummaryResponse extends ReviewPreview {
  csv_id: string;
}

export interface ReviewScrapeSummaryResponse {
  url: string;
  csv_id: string;
  scraped_count: number;
  preview: ReviewPreview;
}

export type ReviewSummaryApiResponse = ReviewSummaryResponse | ReviewScrapeSummaryResponse;
