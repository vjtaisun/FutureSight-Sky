import { FormEvent, useState } from 'react';
import { Spinner } from '@/components/Spinner';

interface ChatComposerProps {
  isStreaming: boolean;
  onSend: (message: string) => Promise<void>;
}

export function ChatComposer({ isStreaming, onSend }: ChatComposerProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    const current = message;
    setMessage('');
    await onSend(current);
  };

  return (
    <form className="chat-composer" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Chat message
      </label>
      <div className="chat-input-shell">
        <textarea
          id="chat-input"
          rows={3}
          placeholder="Ask about your uploaded file or URL"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isStreaming}
        />
        <button
          type="submit"
          className="chat-send"
          aria-label="Send message"
          disabled={isStreaming || !message.trim()}
        >
          {isStreaming ? (
            <Spinner />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11.6l17.2-6.6c.7-.3 1.4.4 1.1 1.1l-6.6 17.2c-.3.8-1.5.8-1.8 0l-2.4-5.6-5.6-2.4c-.8-.3-.8-1.5 0-1.8z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
