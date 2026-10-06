import type { Scenario } from '@/types/scenario';
import { DifficultyDot, Tag } from '@/components/ui/Tag';

export function CharacterProfile({ scenario: s }: { scenario: Scenario }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-[clamp(20px,3vw,32px)] shadow-[0_1px_2px_rgba(16,24,40,.04)]">
      <div className="flex flex-wrap gap-1.5">
        <Tag tone="primary">{s.category}</Tag>
        <Tag>{s.type}</Tag>
        <Tag>
          <DifficultyDot level={s.difficulty} />
          {s.difficulty}
        </Tag>
      </div>
      <h1 className="m-0 text-[clamp(26px,3.4vw,38px)] leading-tight font-extrabold tracking-[-0.03em] text-balance">{s.title}</h1>
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="text-[19px] font-bold">{s.character.name}</div>
          <div className="text-sm text-muted">
            {s.character.role}, {s.character.org}
          </div>
          <div className="mt-1.5 self-start rounded-[10px] bg-page px-3 py-2 text-sm text-body italic">“{s.personality}”</div>
        </div>
      </div>
    </div>
  );
}
