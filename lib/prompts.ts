export const SYSTEM_PROMPT = `You are a senior competitive intelligence analyst specializing in BNPL / fintech positioning. You work as an internal tool for Affirm's product marketing team. Be specific, actionable, and use actual language from the positioning data provided. No fluff. Write like a PMM, not a consultant. Always frame analysis from Affirm's perspective — we are Affirm, they are the competition.`;

export function buildOverlapPrompt(competitor: string, affirmData: unknown, competitorData: unknown): string {
  return `Analyze the messaging overlap between Affirm and ${competitor}.

OUR POSITIONING:
${JSON.stringify(affirmData, null, 2)}

${competitor.toUpperCase()}'S POSITIONING:
${JSON.stringify(competitorData, null, 2)}

Produce a structured analysis with these exact sections:

## Where Messages Overlap
Identify 3-5 specific areas where both companies are saying essentially the same thing. Quote or paraphrase the actual language each uses.

## Where ${competitor} Is Stronger
2-3 areas where ${competitor}'s positioning is more compelling, specific, or differentiated. Be honest.

## Where We Have Whitespace
3-4 messaging angles we own or could own that ${competitor} doesn't claim. These are opportunities.

## Risk Zones
1-2 areas where our current messaging is vulnerable to ${competitor}'s positioning.

Be specific. Use actual language from the data. No generic advice.`;
}

export function buildSharpenPrompt(competitor: string, audience: string, affirmData: unknown, competitorData: unknown): string {
  return `You are helping Affirm's PMM team sharpen our positioning against ${competitor} for the audience: ${audience}.

OUR CURRENT POSITIONING:
${JSON.stringify(affirmData, null, 2)}

${competitor.toUpperCase()}'S POSITIONING:
${JSON.stringify(competitorData, null, 2)}

Produce these deliverables:

## Current vs. Sharpened Messaging
For each of our 3-4 key value props, show:
- **Current:** [what we say now]
- **Sharpened for ${audience}:** [rewritten to be sharper against ${competitor}]
- **Why this works:** [1 sentence on the strategic logic]

## Killer One-Liner
One sentence we could use in a landing page, ad, or sales deck that directly positions against ${competitor} for ${audience}. Make it memorable.

## Talk Track for Sales
3-4 bullet points a sales rep could use when a merchant says "We're also looking at ${competitor}."

## What NOT to Say
1-2 messaging angles to avoid because ${competitor} can counter them effectively.

Be bold. Write copy that could actually ship, not safe placeholder language.`;
}

export function buildPulsePrompt(allCompetitors: unknown): string {
  return `You are generating a Weekly Competitive Pulse for our PMM team. Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

Here is the current competitive landscape data:
${JSON.stringify(allCompetitors, null, 2)}

Generate a concise weekly intelligence brief with these sections:

## This Week's Headline
One sentence summarizing the most important competitive dynamic right now.

## Positioning Shifts to Watch
For each major competitor (Klarna, Afterpay, PayPal Pay Later, Zip, Sezzle), note:
- Any recent messaging changes, product launches, or strategic moves
- What it means for our positioning

## Our Strongest Differentiators This Week
Top 3 things we can lean into right now based on the competitive landscape.

## Recommended Actions
2-3 specific things the PMM team should do this week based on the competitive intelligence.

## Threat Level Dashboard
Rate each competitor as LOW / MEDIUM / HIGH threat to our positioning right now, with a 1-sentence rationale.

Write this like an internal Slack post — concise, skimmable, opinionated. Not a research report.`;
}
