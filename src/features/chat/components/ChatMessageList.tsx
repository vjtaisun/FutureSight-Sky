import { useLayoutEffect, useRef } from 'react';
import type { ChatMessage } from '@/features/chat/types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight;
    });
  }, [messages]);

  return (
    <div className="chat-messages" role="log" aria-live="polite" ref={scrollRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-bubble chat-${message.role}${message.content ? '' : ' chat-loading'}`}
        >
          {message.content ? <p className="chat-text">{message.content}</p> : <span className="chat-shimmer" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
