import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

export function MessageList({ messages, typing }: { messages: ChatMessage[]; typing: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, typing]);

  return (
    <div className="chat-wallpaper flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-[clamp(6px,3vw,40px)] pt-4 pb-5" aria-live="polite">
      <div className="mb-1 self-center rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-muted shadow-[0_1px_1px_rgba(16,24,40,.06)]">Today</div>
      {messages.map((m) => (
        <ChatBubble key={m.id} message={m} />
      ))}
      {typing && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}
