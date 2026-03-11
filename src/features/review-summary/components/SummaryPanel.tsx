import {
  type Gradient,
  type Word,
  type WordCloudProps,
  WordCloud
} from '@isoterik/react-word-cloud';
import type { ReviewSummaryApiResponse, ReviewPreview } from '@/features/review-summary/types/reviewSummary';

interface SummaryPanelProps {
  data: ReviewSummaryApiResponse;
}

export function SummaryPanel({ data }: SummaryPanelProps) {
  const preview: ReviewPreview | undefined = 'preview' in data ? data.preview : data;
  const columns = preview?.columns ?? [];
  const rows = preview?.rows ?? [];
  const stats = preview?.stats ?? {
    row_count: 0,
    column_count: 0,
    sampled_rows: 0,
    null_counts: {},
    unique_counts: {},
    column_types: {}
  };
  const hasRows = rows.length > 0;
  const hasColumns = columns.length > 0;

  const renderColumnSummaryTable = () => {
    const nullCounts = stats.null_counts ?? {};
    const uniqueCounts = stats.unique_counts ?? {};
    const columnTypes = stats.column_types ?? {};
    const columnNames = Array.from(
      new Set([...Object.keys(nullCounts), ...Object.keys(uniqueCounts), ...Object.keys(columnTypes)])
    );
    const maxNull = Math.max(1, ...Object.values(nullCounts));
    const maxUnique = Math.max(1, ...Object.values(uniqueCounts));

    if (columnNames.length === 0) {
      return <p className="empty-state">No column summary data.</p>;
    }

    return (
      <div className="preview-table-wrap">
        <table className="preview-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>Null Count</th>
              <th>Unique Count</th>
            </tr>
          </thead>
          <tbody>
            {columnNames.map((name) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{columnTypes[name] ?? '—'}</td>
                <td>
                  {nullCounts[name] ?? '—'}
                  {typeof nullCounts[name] === 'number' ? (
                    <div className="cell-histogram">
                      <span
                        className="cell-histogram-fill"
                        style={{ width: `${(nullCounts[name] / maxNull) * 100}%` }}
                      />
                    </div>
                  ) : null}
                </td>
                <td>
                  {uniqueCounts[name] ?? '—'}
                  {typeof uniqueCounts[name] === 'number' ? (
                    <div className="cell-histogram">
                      <span
                        className="cell-histogram-fill"
                        style={{ width: `${(uniqueCounts[name] / maxUnique) * 100}%` }}
                      />
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderWordHeatmap = () => {
    const frequencies = stats.word_frequencies ?? [];
    if (frequencies.length === 0) {
      return <p className="empty-state">No word frequency data.</p>;
    }

    const sorted = [...frequencies].sort((a, b) => b.count - a.count).slice(0, 120);
    const maxCount = Math.max(1, ...sorted.map((item) => item.count));
    const minCount = Math.min(...sorted.map((item) => item.count));
    const words: Word[] = sorted.map((item) => ({
      text: item.word,
      value: item.count
    }));

    const gradients: Gradient[] = [
      {
        id: 'heatmapHot',
        type: 'radial',
        stops: [
          { offset: '0%', color: '#ff6b5a' },
          { offset: '100%', color: '#ff8c6a' }
        ]
      },
      {
        id: 'heatmapWarm',
        type: 'radial',
        stops: [
          { offset: '0%', color: '#ff9f8a' },
          { offset: '100%', color: '#ffd4c8' }
        ]
      }
    ];

    const resolveFill: WordCloudProps['fill'] = (word) => {
      const intensity = (word.value - minCount) / Math.max(1, maxCount - minCount);
      return intensity > 0.6 ? 'url(#heatmapHot)' : 'url(#heatmapWarm)';
    };
    const resolveFontSize: WordCloudProps['fontSize'] = (word) => {
      const intensity = (word.value - minCount) / Math.max(1, maxCount - minCount);
      return 16 + intensity * 30;
    };
    let seed = 7;
    const seededRandom: WordCloudProps['random'] = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return (
      <div className="wordcloud-shell">
        <div className="wordcloud-surface">
          <WordCloud
            words={words}
            width={900}
            height={420}
            gradients={gradients}
            fill={resolveFill}
            font="Space Grotesk"
            fontSize={resolveFontSize}
            fontWeight="600"
            rotate={() => 0}
            padding={3}
            spiral="rectangular"
            random={seededRandom}
            enableTooltip={false}
          />
        </div>
        <p className="wordcloud-caption">Higher-frequency words appear more prominently.</p>
      </div>
    );
  };

  return (
    <section className="card summary-card">
      <div className="summary-header">
        <h2 className="section-title">Dataset Preview</h2>
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
          {'scraped_count' in data ? (
            <span className="stat-pill">
              <span className="stat-label">Scraped</span>
              <span className="stat-value">{data.scraped_count}</span>
            </span>
          ) : null}
        </div>
      </div>

      {'url' in data ? <p className="summary-text">Source URL: {data.url}</p> : null}

      <div className="summary-section">
        <h3 className="section-title">Sample Rows</h3>
        {hasRows && hasColumns ? (
          <div className="preview-table-wrap">
            <table className="preview-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${index}-${columns[0] ? String(row[columns[0]] ?? 'row') : 'row'}`}>
                    {columns.map((column) => (
                      <td key={`${index}-${column}`}>
                        {row[column] === null || row[column] === undefined || row[column] === ''
                          ? '—'
                          : String(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No sample rows returned.</p>
        )}
      </div>

      <div className="summary-section">
        <h3 className="section-title">Column Summary</h3>
        {renderColumnSummaryTable()}
      </div>

      <div className="summary-section">
        <h3 className="section-title">Word Frequency Heatmap</h3>
        {renderWordHeatmap()}
      </div>
    </section>
  );
}
