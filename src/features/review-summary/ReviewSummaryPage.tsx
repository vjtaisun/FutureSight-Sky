import { FileUploadCard } from '@/features/review-summary/components/FileUploadCard';
import { SummaryPanel } from '@/features/review-summary/components/SummaryPanel';
import { useReviewSummary } from '@/features/review-summary/hooks/useReviewSummary';
import { ChatPanel } from '@/features/chat/components/ChatPanel';
import futureSightLogo from '../../../assets/svg/futuresight_logo.svg';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useRef, useState } from 'react';

export function ReviewSummaryPage() {
  const { isLoading, error, result, submitFile, submitUrl, clearResult } = useReviewSummary();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  const handleSubmitFile = async (file: File) => {
    await submitFile(file);
  };

  const handleSubmitUrl = async (url: string) => {
    await submitUrl(url);
  };

  const handlePickRequest = () => {
    if (!result) {
      return true;
    }

    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  };

  const handleSubmitRequest = () => {
    if (!result) {
      return true;
    }

    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    clearResult();
    confirmResolver.current?.(true);
    confirmResolver.current = null;
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    confirmResolver.current?.(false);
    confirmResolver.current = null;
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <img className="brand-logo" src={futureSightLogo} alt="FutureSight logo" />
        <div className="page-header-copy">
          <h1 className="page-title">ReviewLens AI</h1>
        </div>
      </header>

      <section className="upload-hero">
        <FileUploadCard
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmitFile}
          onSubmitUrl={handleSubmitUrl}
          onPickRequest={handlePickRequest}
          onSubmitRequest={handleSubmitRequest}
        />
      </section>

      {result ? (
        <section className="results-shell">
          <div className="page-grid">
            <div className="page-left">
              <SummaryPanel data={result} />
            </div>
            <aside className="page-right">
              <ChatPanel csvId={result?.csv_id} />
            </aside>
          </div>
        </section>
      ) : null}
      <ConfirmDialog
        open={confirmOpen}
        title="Replace existing summary?"
        message="Generating a new summary will remove the current one."
        confirmLabel="Replace"
        cancelLabel="Keep current"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </main>
  );
}
