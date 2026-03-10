import { ChatComposer } from '@/features/chat/components/ChatComposer';
import { ChatMessageList } from '@/features/chat/components/ChatMessageList';
import { useChatStream } from '@/features/chat/hooks/useChatStream';

interface ChatPanelProps {
  csvId?: string | null;
}

export function ChatPanel({ csvId }: ChatPanelProps) {
  const { messages, error, isStreaming, sendUserMessage } = useChatStream(csvId);

  return (
    <section className="card chat-card">
      <header className="chat-header">
        <p className="eyebrow">Assistant</p>
      </header>

      <ChatMessageList messages={messages} />

      {error ? <p className="error-text">{error}</p> : null}

      <ChatComposer isStreaming={isStreaming} onSend={sendUserMessage} />
    </section>
  );
}
