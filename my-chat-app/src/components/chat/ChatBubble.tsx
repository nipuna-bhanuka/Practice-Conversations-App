import type { ChatMessage } from '@/types/chat';
import { FeedbackChip } from './FeedbackChip';

export function ChatBubble({ message: m }: { message: ChatMessage }) {
  const isUser = m.sender === 'user';
  return (
    <div className={`flex animate-rise flex-col gap-1.5 px-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`relative max-w-[min(560px,82%)] px-3 pt-2 pb-1.5 text-[15px] leading-normal text-ink shadow-[0_1px_1.5px_rgba(16,24,40,.10)] ${
          isUser ? 'rounded-[12px_0_12px_12px] bg-bubble-user' : 'rounded-[0_12px_12px_12px] bg-white'
        }`}
      >
        {/* bubble tail */}
        {isUser ? (
          <span className="absolute top-0 -right-2 h-0 w-0 border-t-[10px] border-r-8 border-t-bubble-user border-r-transparent" />
        ) : (
          <span className="absolute top-0 -left-2 h-0 w-0 border-t-[10px] border-l-8 border-t-white border-l-transparent" />
        )}
        <span className="break-words whitespace-pre-wrap">{m.text}</span>
        <span className="float-right mt-2 -mr-0.5 -mb-0.5 ml-3.5 inline-flex items-center gap-1 text-[11px] text-subtle">
          {m.time}
          {isUser && <span className="pr-1 text-[11px] font-bold tracking-[-4px] text-primary">✓✓</span>}
        </span>
      </div>
      {isUser && m.feedback && <FeedbackChip feedback={m.feedback} />}
    </div>
  );
}
