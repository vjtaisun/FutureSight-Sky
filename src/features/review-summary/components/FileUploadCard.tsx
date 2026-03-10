import { FormEvent, useRef, useState } from 'react';
import { Spinner } from '@/components/Spinner';

interface FileUploadCardProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (file: File) => Promise<void>;
  onSubmitUrl: (url: string) => Promise<void>;
  onPickRequest?: () => boolean | Promise<boolean>;
  onSubmitRequest?: () => boolean | Promise<boolean>;
}

type UploadMode = 'csv' | 'url';

export function FileUploadCard({
  isLoading,
  error,
  onSubmit,
  onSubmitUrl,
  onPickRequest,
  onSubmitRequest
}: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<UploadMode>('csv');
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleModeChange = (nextMode: UploadMode) => {
    if (isLoading || mode === nextMode) {
      return;
    }
    setMode(nextMode);
    setLocalError(null);
    if (nextMode === 'csv') {
      setUrl('');
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmitRequest) {
      const shouldContinue = await onSubmitRequest();
      if (!shouldContinue) {
        return;
      }
    }

    if (mode === 'csv') {
      if (!file) {
        setLocalError('Please select a CSV file to continue.');
        return;
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        setLocalError('Only .csv files are allowed.');
        return;
      }

      setLocalError(null);
      await onSubmit(file);
      return;
    }

    if (!url.trim()) {
      setLocalError('Please enter a review page URL to continue.');
      return;
    }

    if (!isValidUrl(url.trim())) {
      setLocalError('Please enter a valid URL (including http:// or https://).');
      return;
    }

    setLocalError(null);
    await onSubmitUrl(url.trim());
  };

  const displayedError = localError ?? error;
  const handlePick = async () => {
    if (isLoading) {
      return;
    }

    const shouldContinue = onPickRequest ? await onPickRequest() : true;
    if (shouldContinue) {
      fileInputRef.current?.click();
    }
  };

  return (
    <section className="card upload-card">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-toggle">
          <button
            type="button"
            className={`toggle-pill ${mode === 'csv' ? 'is-active' : ''}`}
            onClick={() => handleModeChange('csv')}
            disabled={isLoading}
          >
            Upload CSV
          </button>
          <button
            type="button"
            className={`toggle-pill ${mode === 'url' ? 'is-active' : ''}`}
            onClick={() => handleModeChange('url')}
            disabled={isLoading}
          >
            Use URL
          </button>
        </div>

        {mode === 'csv' ? (
          <div className="upload-field">
            <input
              id="csv-file"
              name="csv-file"
              type="file"
              accept=".csv,text/csv"
              disabled={isLoading}
              className="file-input"
              ref={fileInputRef}
              onChange={(event) => {
                setLocalError(null);
                setFile(event.target.files?.[0] ?? null);
                setUrl('');
              }}
            />
            <button type="button" className="file-pill" onClick={handlePick} disabled={isLoading}>
              Choose CSV
            </button>
            <span className="file-name">{file?.name ?? 'No file selected'}</span>
          </div>
        ) : (
          <>
            <div className="upload-field url-field">
              <label htmlFor="review-url" className="sr-only">
                Review URL
              </label>
              <input
                id="review-url"
                name="review-url"
                type="url"
                placeholder="https://example.com/reviews"
                value={url}
                onChange={(event) => {
                  setLocalError(null);
                  setUrl(event.target.value);
                  if (file) {
                    setFile(null);
                  }
                }}
                disabled={isLoading}
                className="text-input"
              />
            </div>
          </>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? (
            <>
              <Spinner /> Processing...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
      </form>
      {displayedError ? <p className="error-text">{displayedError}</p> : null}
      {mode === 'url' ? (
          <div className="warning-callout" role="note" aria-live="polite">
            <span className="warning-icon" aria-hidden="true">
              !
            </span>
            <p>
              URL summaries can be less reliable due to page layout and access restrictions. For best results, upload
              a CSV file.
            </p>
          </div>
        ) : null}
    </section>
  );
}
