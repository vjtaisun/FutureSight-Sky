import type { ReviewSummaryResponse } from '@/features/review-summary/types/reviewSummary';

interface SummaryPanelProps {
  data: ReviewSummaryResponse;
}

export function SummaryPanel({ data }: SummaryPanelProps) {
  const { summary, stats } = data;

  return (
    <section className="card summary-card">
      <div className="summary-header">
        <h2 className="section-title">Summary</h2>
        <div className="summary-header-meta">
          <div className="summary-stats">
            <div className="stat-pill">
              <span className="stat-label">Rows</span>
              <span className="stat-value">{stats.row_count}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Columns</span>
              <span className="stat-value">{stats.column_count}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Sampled</span>
              <span className="stat-value">{stats.sampled_rows}</span>
            </div>
          </div>
          <span className={`sentiment-badge sentiment-${data.sentiment}`}>Sentiment: {data.sentiment}</span>
        </div>
      </div>

      <p className="summary-text">{summary}</p>

      <div className="summary-section">
        <h3 className="section-title">Key Themes</h3>
        <div className="keywords-wrap">
          {data.key_themes.map((theme) => (
            <span key={theme} className="keyword-chip">
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div className="summary-lists">
        <div className="summary-section">
          <h3 className="section-title">Common Issues</h3>
          <ul className="bullet-list">
            {data.common_issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
