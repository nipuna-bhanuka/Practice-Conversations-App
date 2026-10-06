/**
 * MOCK ONLY — scripted replies and keyword scoring so the UI works without a backend.
 * Delete this folder once /api/chat/* is backed by Claude.
 */
export interface MockScript {
  /** follow-up questions asked after a good answer */
  questions: string[];
  /** one hint per question stage */
  hints: string[];
  closing: string;
  outLine: string;
  neutral: string;
  /** trap id → reply when that trap is hit */
  pushback: Record<string, string>;
  /** trap id → pattern that triggers it */
  trapPatterns: Record<string, RegExp>;
  /** a better line to suggest when a trap is hit */
  upgrades: Record<string, string>;
  /** words that signal a concrete, useful answer */
  strong: string[];
}

export const MOCK_SCRIPTS: Record<string, MockScript> = {
  'agentic-design-review': {
    questions: [
      'A deterministic validation layer. Then how does it persist state if the connection drops?',
      'Good. If the route assessment is wrong, who is accountable — the system or my supervisor?',
      'What would my board actually see each quarter to know this is working?',
      'And if something goes badly wrong on a Friday night, how fast can we switch it off?',
      'Last one. What exactly do I tell the board has changed for customs declarations?',
    ],
    hints: [
      'She wants the mechanism, not reassurance. Name the check that stops a bad action before it runs.',
      'She wants to know what happens at 2am when the line drops. Describe saved checkpoints, not memory.',
      'Name the owner. Every routing decision is logged against the supervisor who approved the rule set.',
      'Offer concrete measures from the board reporting step: exception rate, overrides, time to clearance.',
      'Describe the switch-off: agentic steps pause and every consignment falls back to manual intake.',
      'Pre-fill only drafts declarations. A person still submits them — nothing files without sign-off.',
    ],
    closing: 'That I can present. Clear controls, clear ownership. Send me the one-page version tonight.',
    outLine: 'We are out of time, Amila. I can’t take this to the board yet.',
    neutral: 'That is vague. What actually happens, step by step?',
    pushback: {
      analogy: 'Another metaphor. My board does not approve metaphors, Amila.',
      code_wall: 'I do not know what that means, and neither will my board.',
      deflection: '“Safe” is a conclusion. I asked for the mechanism.',
    },
    trapPatterns: {
      analogy: /(think of|imagine|like a |it'?s like|it’s like|kind of like|basically a |similar to a |smart assistant|brain|magic|clerk)/,
      code_wall: /\b(json|webhooks?|payloads?|class|classes|apis?|endpoints?|lambda|kafka|sdk|regex|llm|prompts?|tokens?|embeddings?|decorators?|vector)\b/,
      deflection: /(it'?s safe|it’s safe|it is safe|don'?t worry|don’t worry|trust me|no risk|totally covered|nothing to worry)/,
    },
    upgrades: {
      analogy: 'It can only run pre-approved query formats on existing fields. Anything outside those formats stops in an exception queue for supervisor sign-off.',
      code_wall: 'The system can only take actions from a fixed, pre-approved list. Anything else is blocked and sent to a supervisor.',
      deflection: 'Every action is checked against a validation rule before it runs. If it fails, it stops and waits for a supervisor.',
    },
    strong: ['checkpoint', 'saved', 'resume', 'queue', 'sign-off', 'sign off', 'signed', 'threshold', 'supervisor', 'logged', 'log ', 'audit', 'validation', 'pre-approved', 'schema', 'halt', 'pause', 'manual', 'fallback', 'report', 'override', 'owner', 'accountab', 'approve', 'exception', 'rate'],
  },

  'robotic-email-escalation': {
    questions: [
      'Fine. But how do I know it won’t happen again next week?',
      'My customers already got those emails. What are you doing about them?',
      'And when something looks wrong, who do I call? I don’t want a ticket number.',
      'What will be different this month, specifically?',
    ],
    hints: [
      'Start by owning it. Name what his customers experienced before explaining anything.',
      'Describe the process change: a person on his team approves replies before they send.',
      'Offer a concrete remedy — a personal follow-up to affected customers, drafted for his approval.',
      'Give him a name, a direct line and a response time.',
      'Commit to dates: a weekly review call and a tone check against his own past emails.',
    ],
    closing: 'Alright. That I can live with. You have one month — don’t make me call again.',
    outLine: 'I’ve heard enough for today. I’ll think about whether we continue.',
    neutral: 'That tells me nothing. What are you actually going to do?',
    pushback: {
      jargon: 'I sell rice and spices. I don’t know what that means.',
      blame: 'Excuse me? We paid your firm to deliver a working system. Now it is my staff’s fault?',
      empty_apology: 'Sorry doesn’t fix anything. What are you going to change?',
    },
    trapPatterns: {
      jargon: /\b(tokens?|parameters?|prompts?|zero-shot|fine-?tun\w*|temperature|llm|model|hallucinat\w*)\b/,
      blame: /(your (team|staff|people) (was|were) supposed|you (never|didn'?t|did not) (send|give|provide)|not our fault|should have (sent|given|provided))/,
      empty_apology: /^(i'?m |we'?re |i am |we are )?(so |very |really )?(sorry|apologi[sz]e)[^.?!]{0,40}[.?!]?$/,
    },
    upgrades: {
      jargon: 'The system worked, but it was never shown how your company writes. That’s on us, and we’re fixing it this week.',
      blame: 'We sent 140 emails that didn’t sound like you. That’s on us, and here’s what we’ve changed.',
      empty_apology: 'I’m sorry — and from today your team approves every reply before it goes out.',
    },
    strong: ['sorry', 'apolog', 'our fault', 'on us', 'responsib', 'approve', 'approval', 'review', 'before', 'call', 'direct', 'weekly', 'friday', 'monday', 'follow up', 'follow-up', 'credit', 'refund', 'check', 'tone', 'your team', 'personally'],
  },

  'discount-demand': {
    questions: [
      'Suppose I accept that. What do I get if I sign for three years instead of one?',
      'My CFO will still ask why we didn’t take the cheaper option. What do I tell her?',
      'And if the rollout slips, what happens to our price?',
    ],
    hints: [
      'Ask what’s in the competitor’s quote, then compare scope — onboarding, support, rollout.',
      'Trade: a longer term or a phased start in exchange for a smaller discount.',
      'Give her a one-line business case: total cost over three years, not the sticker price.',
      'Offer a service-level credit tied to rollout dates, not a price cut.',
    ],
    closing: 'That is a case I can take to my CFO. Send the revised terms by Thursday.',
    outLine: 'I think we’ll go with the other quote for now.',
    neutral: 'I need numbers, not reassurance.',
    pushback: {
      cave: 'So your price was never real? That makes me wonder what else is padded.',
      bash: 'I didn’t ask about them. I asked why you cost more.',
      vague_value: '“Better” isn’t a number. Show me.',
    },
    trapPatterns: {
      cave: /(we can (do|give|offer) (a )?(discount|\d+ ?%)|match (their|the|that) price|ok(ay)?,? (we'?ll|i'?ll) (match|lower|drop))/,
      bash: /(not as good|they('re| are) (worse|terrible|cheap|bad)|their product is (bad|worse|cheap))/,
      vague_value: /(we'?re (the )?best|better quality|worth it|trust me|premium product)/,
    },
    upgrades: {
      cave: 'If we move on price, I’d need a three-year term or a phased rollout to make it work.',
      bash: 'Let’s compare scope — onboarding and support are priced separately in their quote.',
      vague_value: 'Over three years, onboarding and support included, our total cost is about 6% higher — for four stores live in eight weeks.',
    },
    strong: ['include', 'scope', 'onboarding', 'support', 'term', 'three-year', '3-year', 'phased', 'total cost', 'over three', 'in exchange', 'if you', 'saving', 'cost', 'per store'],
  },

  'outage-post-mortem': {
    questions: [
      'Why did it take us seventeen minutes to even notice?',
      'What stops this exact thing happening next Friday?',
      'Who signs off on the fix, and when do I see it in writing?',
    ],
    hints: [
      'Walk the timeline: release, retry spike, alert, rollback — with times.',
      'Own the detection gap: the alert threshold was too high. Say what it is now.',
      'Name the specific changes: capped retries, a faster alert, no Friday releases.',
      'Give an owner and a date for the written post-mortem.',
    ],
    closing: 'Good. That’s a post-mortem I can share with the board. Put it in writing today.',
    outLine: 'I still don’t have a clear picture. We’ll continue this tomorrow.',
    neutral: 'Be precise. Times, causes, changes.',
    pushback: {
      blame: 'I don’t care whose server it was. What did we do?',
      vague: '“Looking into it” is not an answer. What do you know right now?',
      buzzwords: 'Drop the jargon. Tell me in one sentence what broke.',
    },
    trapPatterns: {
      blame: /(third[- ]party|vendor|provider'?s fault|not our fault|their fault|their side)/,
      vague: /(looking into it|still investigating|some issues|had issues|not sure yet)/,
      buzzwords: /\b(kubernetes|k8s|pods?|exponential backoff|circuit breakers?|p99|idempoten\w*|microservices?)\b/,
    },
    upgrades: {
      blame: 'Our retry setting overloaded the payment provider for 47 minutes. We own that.',
      vague: 'At 22:10 we released, at 22:14 retries spiked, the alert fired at 22:31 and rollback finished at 23:01.',
      buzzwords: 'Our system kept re-sending failed payments too fast, which overloaded the provider.',
    },
    strong: ['22:', 'minute', 'release', 'retry', 'retries', 'rollback', 'alert', 'threshold', 'cap', 'own', 'changed', 'freeze', 'timeline', 'root cause', 'friday'],
  },

  'renewal-on-the-line': {
    questions: [
      'If adoption was the problem, why didn’t anyone fix it earlier?',
      'What would you need from me, and what do I get if it works?',
      'And if the pilot doesn’t move the numbers?',
    ],
    hints: [
      'Start with the real number and where it is working. Don’t spin it.',
      'Own the gap: onboarding stopped after launch. Say what you would do differently.',
      'Propose a 30-day pilot with one measure she cares about, reported weekly.',
      'Offer a clear exit: if the measure doesn’t move, she can walk away without penalty.',
    ],
    closing: 'That’s fair and measurable. Let’s run the pilot, then talk renewal.',
    outLine: 'I don’t have enough to justify the renewal. Let’s leave it there.',
    neutral: 'I need something I can measure.',
    pushback: {
      spin: 'Thirty percent is not “picking up”. Please be straight with me.',
      blame: 'My staff are nurses, not software testers. Try again.',
      vague_plan: 'More training is what I was promised last time.',
    },
    trapPatterns: {
      spin: /(picking up|going well|trending up|great adoption|very popular|really positive)/,
      blame: /(your staff|they (didn'?t|did not|don'?t)|previous director|not our fault)/,
      vague_plan: /(some (more )?training|we'?ll (look|monitor)|keep an eye|see how it goes)/,
    },
    upgrades: {
      spin: 'Adoption is at 30%, mostly in two wards. Here’s what’s different about those wards.',
      blame: 'Onboarding stopped after launch — that’s on us, not your staff.',
      vague_plan: 'A 30-day pilot in three wards, with no-show rates reported to you weekly.',
    },
    strong: ['30%', 'ward', 'pilot', '30-day', 'weekly', 'report', 'no-show', 'measure', 'should have', 'onboarding', 'three wards', 'our fault', 'on us'],
  },
};
