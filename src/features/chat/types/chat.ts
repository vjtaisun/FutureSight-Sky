export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  previous_response_id?: string;
  model: string;
  temperature: number;
  max_output_tokens: number;
}

export interface ChatDoneEvent {
  response_id?: string;
  model?: string;
  usage?: Record<string, number>;
  [key: string]: unknown;
}

export interface ChatErrorEvent {
  message: string;
}

export interface StreamChatHandlers {
  onToken: (text: string) => void;
  onDone?: (meta: ChatDoneEvent) => void;
  onError?: (message: string) => void;
}
