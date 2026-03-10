export interface ReviewSummaryStats {
  row_count: number;
  column_count: number;
  sampled_rows: number;
}

export interface ReviewSummaryResponse {
  url?: string;
  csv_id: string;
  scraped_count?: number;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  key_themes: string[];
  common_issues: string[];
  recommendations: string[];
  stats: ReviewSummaryStats;
}
