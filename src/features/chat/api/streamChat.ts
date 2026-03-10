import { config } from '@/lib/config';
import { ApiError } from '@/lib/http';
import type {
  ChatDoneEvent,
  ChatErrorEvent,
  ChatRequestPayload,
  StreamChatHandlers
} from '@/features/chat/types/chat';

const CHAT_STREAM_PATH = '/api/v1/chat/stream';

function parseSseEvent(chunk: string): { event?: string; data?: string } {
  const lines = chunk.split('\n');
  let event: string | undefined;
  const dataParts: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataParts.push(line.slice(5).trim());
    }
  }

  return { event, data: dataParts.join('') };
}

export async function streamChat(
  payload: ChatRequestPayload,
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${config.apiBaseUrl}${CHAT_STREAM_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    let message = `Chat request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as { detail?: string };
      if (errorPayload.detail) {
        message = errorPayload.detail;
      }
    } catch {
      // no-op: fallback message is already set
    }

    throw new ApiError(message, response.status);
  }

  if (!response.body) {
    throw new ApiError('No response stream from chat API.', response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const eventChunk of events) {
      const { event, data } = parseSseEvent(eventChunk);
      if (!event || !data) {
        continue;
      }

      if (event === 'token') {
        const tokenPayload = JSON.parse(data) as { text?: string };
        if (tokenPayload.text) {
          handlers.onToken(tokenPayload.text);
        }
      }

      if (event === 'done') {
        const donePayload = JSON.parse(data) as ChatDoneEvent;
        handlers.onDone?.(donePayload);
      }

      if (event === 'error') {
        const errorPayload = JSON.parse(data) as ChatErrorEvent;
        const message = errorPayload.message || 'Unexpected chat stream error.';
        handlers.onError?.(message);
        throw new ApiError(message, response.status);
      }
    }
  }
}
