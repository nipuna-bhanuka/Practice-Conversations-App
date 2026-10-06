import type { Scenario } from '@/types/scenario';

/**
 * Scenario content shown in the UI.
 * When the backend is ready, this moves to the server and the frontend
 * fetches it from GET /api/scenarios — see api/scenarios.ts.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'agentic-design-review',
    category: 'Technology',
    type: 'Executive Presentation',
    title: 'Agentic Workflow Design Review',
    difficulty: 'Intermediate',
    description: 'Explain AI routing controls to a skeptical COO without analogies or developer jargon.',
    personality: 'Skeptical of buzzwords, protective of operational integrity',
    situation:
      'You are Amila, a Forward Deployed Engineer. You have ten minutes of a COO’s time to make an agentic routing design clear enough for her board. She is not hostile. She is accountable.',
    goal: 'Explain the AI’s controls in precise business language she could present to a board.',
    character: { name: 'Mrs. Jayasinghe', role: 'Chief Operations Officer', org: 'Lanka Logistics', initials: 'MJ', color: '#6D28D9', pronoun: 'she' },
    metric: { label: 'Board Risk Friction', start: 75, target: 30 },
    maxTurns: 10,
    openingLine:
      'Amila, looking at your proposed diagram, this ‘agentic routing’ looks like a complete black box to our board. What technical guardrails prevent it from executing a disastrously incorrect database action?',
    dos: [
      { topic: 'Guardrails', dont: '“We’ve put guardrails on it.”', do: '“Hardcoded validation layers route any out-of-bounds input to a supervisor before execution.”', why: '“Guardrails” names a feeling, not a control. She needs to know what stops what.' },
      { topic: 'Tool calling', dont: '“The agent calls tools.”', do: '“Deterministic queries, triggered only when fields match a pre-verified schema.”', why: 'Replace the actor with the rule. Boards approve rules, not agents.' },
      { topic: 'Human in the loop', dont: '“There’s always a human in the loop.”', do: '“Any consignment above the value threshold halts in the exception queue until signed off.”', why: 'Say where the human sits, what triggers them and what they sign.' },
    ],
    traps: [
      { id: 'analogy', name: 'The Analogy Penalty', chipLabel: 'Analogy trap', penalty: 15, description: 'Using metaphors like “a smart assistant”' },
      { id: 'code_wall', name: 'The Code Wall', chipLabel: 'Code wall', penalty: 15, description: 'Raw jargon like classes, webhooks, JSON payloads' },
      { id: 'deflection', name: 'Defensive Deflection', chipLabel: 'Deflection', penalty: 10, description: 'Saying it’s safe without explaining how' },
    ],
    reference: {
      type: 'workflow',
      title: 'Proposed workflow',
      nodes: [
        { tag: 'MANUAL', label: 'Consignment intake' },
        { tag: 'AGENTIC', label: 'Route assessment agent' },
        { tag: 'AGENTIC', label: 'Declaration pre-fill' },
        { tag: 'GATE', label: 'Exception queue' },
        { tag: 'MANUAL', label: 'Board reporting' },
      ],
    },
  },
  {
    id: 'robotic-email-escalation',
    category: 'Consulting',
    type: 'Escalation Recovery',
    title: 'The Robotic Email Escalation',
    difficulty: 'Advanced',
    description: 'Win back a frustrated client who thinks your team shipped buggy code.',
    personality: 'Blunt, loyal to his customers, out of patience',
    situation:
      'You are Amila, the delivery lead. Last week your team’s email assistant sent 140 replies to Mr. Perera’s customers in a stiff, robotic tone. He believes your team shipped buggy code, and he has called you directly.',
    goal: 'Own the problem, explain what went wrong in plain terms, and give him a concrete plan he trusts.',
    character: { name: 'Mr. Perera', role: 'Owner', org: 'Perera Trading', initials: 'MP', color: '#0E7490', pronoun: 'he' },
    metric: { label: 'Client Frustration', start: 80, target: 30 },
    maxTurns: 10,
    openingLine:
      'Your team promised me an assistant that answers my customers. Instead they are getting robotic nonsense. Why should I keep paying you?',
    dos: [
      { topic: 'Apology', dont: '“Sorry for any inconvenience.”', do: '“We sent 140 emails that didn’t sound like you. That’s on us.”', why: 'Specific ownership lowers friction faster than generic regret.' },
      { topic: 'Root cause', dont: '“The model hallucinated.”', do: '“Replies went out without a person checking them first. We’ve changed that.”', why: 'He needs the cause as a process, not as model behaviour.' },
      { topic: 'Next steps', dont: '“We’ll monitor it closely.”', do: '“Your team approves every reply before it sends, starting today, until you say otherwise.”', why: 'Put control back in his hands.' },
    ],
    traps: [
      { id: 'jargon', name: 'The Jargon Wall', chipLabel: 'Jargon', penalty: 10, description: 'Tokens, prompts, parameters — to a man who sells rice and spices' },
      { id: 'blame', name: 'Blame Transfer', chipLabel: 'Blame transfer', penalty: 15, description: 'Hinting his team supplied poor instructions' },
      { id: 'empty_apology', name: 'The Empty Apology', chipLabel: 'Empty apology', penalty: 8, description: 'Apologising without saying what will change' },
    ],
    reference: {
      type: 'workflow',
      title: 'Incident timeline',
      nodes: [
        { tag: 'MANUAL', label: 'Mon · FAQ handed over' },
        { tag: 'AGENTIC', label: 'Tue · Auto-replies go live' },
        { tag: 'AGENTIC', label: 'Wed · 140 replies sent unchecked' },
        { tag: 'GATE', label: 'Thu · Review gate added' },
        { tag: 'MANUAL', label: 'Today · Call with Mr. Perera' },
      ],
    },
  },
  {
    id: 'discount-demand',
    category: 'Sales',
    type: 'Pricing Negotiation',
    title: 'The 20% Discount Demand',
    difficulty: 'Intermediate',
    description: 'Hold your price with a procurement lead who has a competitor’s quote on the table.',
    personality: 'Data-driven, patient, will walk away if pushed',
    situation:
      'You are Amila, the account executive. Serendib Retail is ready to sign a three-year contract — if you match a competitor’s price, 20% below yours. Ms. Fernando has the quote printed and on the table.',
    goal: 'Defend the value of your offer in her terms, and trade concessions instead of giving them away.',
    character: { name: 'Ms. Fernando', role: 'Head of Procurement', org: 'Serendib Retail', initials: 'MF', color: '#C2410C', pronoun: 'she' },
    metric: { label: 'Deal Friction', start: 70, target: 30 },
    maxTurns: 10,
    openingLine: 'Your competitor is 20% cheaper for what looks like the same thing. Why would I pay more?',
    dos: [
      { topic: 'Price', dont: '“We can probably do something on price.”', do: '“If we move on price, I’d need a longer term or a phased rollout to make it work.”', why: 'Every concession should buy something back.' },
      { topic: 'Competitor', dont: '“Their product isn’t as good.”', do: '“Let’s compare scope — onboarding and support are priced separately in their quote.”', why: 'Compare calmly; attacking rivals reads as insecurity.' },
    ],
    traps: [
      { id: 'cave', name: 'The Instant Discount', chipLabel: 'Gave it away', penalty: 15, description: 'Dropping the price without getting anything back' },
      { id: 'bash', name: 'Competitor Bashing', chipLabel: 'Competitor bashing', penalty: 10, description: 'Attacking the rival instead of comparing scope' },
      { id: 'vague_value', name: 'Vague Value', chipLabel: 'Vague value', penalty: 10, description: '“We’re better quality” with no numbers behind it' },
    ],
    reference: {
      type: 'workflow',
      title: 'Deal structure',
      nodes: [
        { tag: 'MANUAL', label: 'Discovery · 4 stores' },
        { tag: 'MANUAL', label: 'Proposal · 3-year term' },
        { tag: 'GATE', label: 'Procurement review' },
        { tag: 'MANUAL', label: 'Board sign-off' },
      ],
    },
  },
  {
    id: 'outage-post-mortem',
    category: 'Technology',
    type: 'Incident Review',
    title: 'The Outage Post-mortem',
    difficulty: 'Advanced',
    description: 'Walk a CTO through last night’s outage without hiding behind blame or buzzwords.',
    personality: 'Precise, impatient with blame, wants root causes',
    situation:
      'You are Amila, the on-call lead. Payments were down for 47 minutes last night. Mr. Silva has read the alerts, not the story. He wants to know what happened and whether it will happen again.',
    goal: 'Give a clear timeline, the root cause in plain terms, and the specific changes you are making.',
    character: { name: 'Mr. Silva', role: 'Chief Technology Officer', org: 'Colombo FinServe', initials: 'MS', color: '#BE185D', pronoun: 'he' },
    metric: { label: 'Trust Friction', start: 85, target: 35 },
    maxTurns: 10,
    openingLine: 'Forty-seven minutes of failed payments. Start from the beginning — what happened?',
    dos: [
      { topic: 'Root cause', dont: '“A third-party service had issues.”', do: '“Our retry setting overloaded the payment provider for 47 minutes. We own that.”', why: 'Owning the cause earns trust faster than pointing outward.' },
      { topic: 'Prevention', dont: '“We’re looking into it.”', do: '“Retries are now capped, and an alert fires within two minutes of a spike.”', why: 'Name the change and how you will know it worked.' },
    ],
    traps: [
      { id: 'blame', name: 'Pointing Outward', chipLabel: 'Blame shift', penalty: 15, description: 'Blaming the vendor or a third party first' },
      { id: 'vague', name: 'The Fog', chipLabel: 'Too vague', penalty: 10, description: '“We’re looking into it” with no times or causes' },
      { id: 'buzzwords', name: 'Buzzword Cover', chipLabel: 'Buzzwords', penalty: 10, description: 'Hiding the cause behind infrastructure jargon' },
    ],
    reference: {
      type: 'workflow',
      title: 'Incident timeline',
      nodes: [
        { tag: 'MANUAL', label: '22:10 · Release deployed' },
        { tag: 'AGENTIC', label: '22:14 · Automatic retries spike' },
        { tag: 'GATE', label: '22:31 · Alert escalated' },
        { tag: 'MANUAL', label: '23:01 · Rollback complete' },
      ],
    },
  },
  {
    id: 'renewal-on-the-line',
    category: 'Sales',
    type: 'Renewal Risk',
    title: 'Renewal on the Line',
    difficulty: 'Beginner',
    description: 'Save a renewal after six months of low adoption and a skeptical new director.',
    personality: 'New in the role, fair, skeptical of past decisions',
    situation:
      'You are Amila, the customer success manager. Only 30% of Kandy Health’s staff have used your scheduling tool since launch. Dr. Wickramasinghe inherited the contract, and the renewal is due in three weeks.',
    goal: 'Acknowledge the adoption gap honestly and propose a specific, low-risk plan to prove value before renewal.',
    character: { name: 'Dr. Wickramasinghe', role: 'Director of Operations', org: 'Kandy Health Group', initials: 'DW', color: '#15803D', pronoun: 'she' },
    metric: { label: 'Renewal Risk', start: 72, target: 30 },
    maxTurns: 10,
    openingLine: 'I’ve seen the usage numbers. Why should I renew something most of my staff don’t use?',
    dos: [
      { topic: 'Adoption', dont: '“Usage is picking up.”', do: '“Adoption is at 30%, mostly in two wards. Here’s what’s different about those wards.”', why: 'Honest numbers build credibility with a new decision-maker.' },
      { topic: 'Next step', dont: '“Let’s schedule some training.”', do: '“A 30-day pilot in three wards, with no-show rates reported to you weekly.”', why: 'A measurable, time-boxed plan lowers her risk.' },
    ],
    traps: [
      { id: 'spin', name: 'The Spin', chipLabel: 'Spin', penalty: 15, description: 'Dressing up 30% adoption as good news' },
      { id: 'blame', name: 'Blaming the Staff', chipLabel: 'Blame', penalty: 10, description: 'Suggesting her team just didn’t try' },
      { id: 'vague_plan', name: 'The Vague Plan', chipLabel: 'Vague plan', penalty: 10, description: '“Some more training” with no measure or date' },
    ],
    reference: {
      type: 'workflow',
      title: 'Account history',
      nodes: [
        { tag: 'MANUAL', label: 'Jan · Contract signed' },
        { tag: 'MANUAL', label: 'Mar · Launch in 8 wards' },
        { tag: 'GATE', label: 'Jun · Adoption at 30%' },
        { tag: 'MANUAL', label: 'Oct · Renewal decision' },
      ],
    },
  },
];
