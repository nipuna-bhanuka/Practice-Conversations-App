import type { NodeTag, WorkflowReference } from '@/types/scenario';

const TAG_STYLE: Record<NodeTag, { bg: string; fg: string; border: string }> = {
  MANUAL: { bg: '#F2F4F7', fg: '#475467', border: '#E6E8EE' },
  AGENTIC: { bg: '#EEF0FF', fg: '#4338CA', border: '#DADFFF' },
  GATE: { bg: '#FEF3E2', fg: '#B45309', border: '#F6DDAE' },
};

export function WorkflowNodes({ reference }: { reference: WorkflowReference }) {
  return (
    <div className="flex flex-col">
      <div className="mb-2.5 text-[13px] font-bold text-body">{reference.title}</div>
      {reference.nodes.map((n, i) => {
        const c = TAG_STYLE[n.tag];
        return (
          <div key={n.label} className="flex flex-col">
            <div className="flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5" style={{ borderColor: c.border }}>
              <span className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide" style={{ background: c.bg, color: c.fg }}>
                {n.tag}
              </span>
              <span className="text-sm font-semibold text-ink">{n.label}</span>
            </div>
            {i < reference.nodes.length - 1 && <div className="ml-8 h-3.5 w-0.5 bg-[#D5D9E4]" />}
          </div>
        );
      })}
    </div>
  );
}
