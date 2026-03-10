import { useMemo, useRef, useState } from 'react';
import { streamChat } from '@/features/chat/api/streamChat';
import type { ChatMessage, ChatRole } from '@/features/chat/types/chat';
import { ApiError } from '@/lib/http';

const SYSTEM_PROMPT = 'You are a helpful assistant.';
const DEFAULT_MODEL = 'gpt-4.1-mini';
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_OUTPUT_TOKENS = 700;

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content
  };
}

export function useChatStream(csvId?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canSend = useMemo(() => !isStreaming, [isStreaming]);

  const sendUserMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) {
      return;
    }

    setError(null);
    const userMessage = createMessage('user', trimmed);
    const assistantId = `assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: ''
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    try {
      await streamChat(
        {
          message: `${SYSTEM_PROMPT}\n\n${trimmed}`,
          ...(csvId ? { csv_id: csvId } : {}),
          ...(previousResponseId ? { previous_response_id: previousResponseId } : {}),
          model: DEFAULT_MODEL,
          temperature: DEFAULT_TEMPERATURE,
          max_output_tokens: DEFAULT_MAX_OUTPUT_TOKENS
        },
        {
          onToken: (text) => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, content: `${message.content}${text}` }
                  : message
              )
            );
          },
          onDone: (meta) => {
            if (meta.response_id) {
              setPreviousResponseId(meta.response_id);
            }
          },
          onError: (message) => {
            setError(message);
          }
        },
        controller.signal
      );
    } catch (unknownError) {
      if (unknownError instanceof DOMException && unknownError.name === 'AbortError') {
        setError('Chat generation was canceled.');
      } else if (unknownError instanceof ApiError) {
        setError(unknownError.message);
      } else {
        setError('Unable to complete chat request.');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
  };

  return {
    messages,
    error,
    isStreaming,
    canSend,
    sendUserMessage,
    stopStreaming
  };
}
