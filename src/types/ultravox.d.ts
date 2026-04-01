declare global {
  interface Window {
    UltravoxSession: {
      new (config: { experimentalMessages: Set<string> }): {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addEventListener: (event: string, handler: (e: any) => void) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        joinCall: (url: string) => Promise<any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leaveCall: () => Promise<any>;
        _status?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _transcripts?: any[];
      };
    };
    debugMessages: Set<string>;
  }
}

export interface Transcript {
  text: string
  isFinal: boolean
  speaker: 'user' | 'agent'
  medium: 'voice' | 'text'
}

export interface CallResponse {
  callId: string
  joinUrl: string
  systemPrompt: string
  voice: string
  model: string
}

export enum UltravoxSessionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking'
}
