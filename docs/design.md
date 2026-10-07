# Design: understanding is the product

## What comes from Karpathy

The [original post](https://x.com/karpathy/status/2105819303471976479) anticipates a
shift from performing all the work to overseeing and understanding model output.
It suggests controlled writing, diagrams/images, interactive webpages, and bespoke
explainer videos. It also argues that a custom, disposable explanatory artifact
can now be worth making for one person and one question.

This project preserves all four forms. It does not reduce the idea to a word-count
limit or claim Karpathy supplied a universal format-selection algorithm.

## What this project adds

Our interpretation is to optimize total reader effort: time to understand the
answer, assess its basis, and choose the next action. Generating a richer artifact
has a cost and can increase attention demands. Hence "choose the simplest form
that works" is our design decision, not a quotation or a measured law.

The core distinguishes rewriting, summarizing, and reasoning. A rewrite must not
invent facts. A summary selects material without hiding consequential exceptions.
An analysis must reason, but mark unsupported hypotheses as hypotheses. Conflating
these jobs produces either fabricated certainty or unhelpful refusal to infer.

## Lessons from related projects

These are source-level observations, not claims from controlled comparisons.
Reviewed on 2026-10-07; upstream projects can change.

| Source | Keep | Change here |
| --- | --- | --- |
| [prithivrajmu/asd-ste100](https://github.com/prithivrajmu/asd-ste100) | Plain language, preservation of confidence, four formats | No strict-compliance promise; distinguish task types; language-specific guidance |
| [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill) | Meaning and modality matter more than mechanical brevity | Focus on human understanding, not only English rewriting |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | Answer-first, visible progress, respect host requirements | No assumptions about a reader's diagnosis; no mandatory recap every turn |
| [dualface/ste-zh](https://github.com/dualface/ste-zh) | Chinese result reporting and explicit verification state | No fixed universal status vocabulary or mandatory replacement of modal words |
| [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) | Figures expose mechanisms; detail can be interactive | No automatic HTML for a small table; preserve meaningful hedges; offline-first |
| [ajithraghavan/make-it-click](https://github.com/ajithraghavan/make-it-click) | Format choice and oversight questions | Add rewrite/summary boundaries, non-English adaptation, controlled evaluation |

## Why not a renderer or a large agent framework?

A skill should guide tools already available in the host. A mandatory browser,
video toolchain, custom installer, or cloud account would make installation harder
and introduce unrelated execution risks. References describe concrete validation
and fallback steps without claiming those tools are bundled.

Video remains a first-class documented route, not an installed renderer. This
is both a limitation and a deliberate scope choice for version 0.1.

## Multilingual, not English with translated headings

Use the user's language and natural grammar. Preserve technical literals and
evidence. Language guidance covers Chinese, English, Japanese/CJK, inflected
languages, and right-to-left presentation. Do not equate word counts across
languages or market fixtures as proof of fluency.

README editions are included in English, Simplified Chinese, Japanese, Spanish,
and Arabic; the linked advanced guides remain in English. Examples and evaluation
cases cover those five languages. Translations are drafts, not evidence of fluent
model output. Fluent review and model trials remain necessary before claiming
validated support. Navigation and command checks catch drift, not translation errors.

## Failure modes worth testing

- A shorter sentence changes authentication into interactive login.
- "May have failed" becomes "failed"; a probable cause becomes a proven cause.
- A passing unit test becomes "fully verified".
- A vendor's assertion becomes the agent's own verified observation, or conflicting
  reports from different environments collapse into one finding.
- An outdated hypothesis survives new evidence, or caution hides a now-established fact.
- A style rule adds prose to JSON-only output or hides severe review findings behind
  a generic conclusion.
- A diagram makes an inferred edge appear observed.
- A summary drops a negation, unit, exception, or production limitation.
- A pretty HTML artifact executes untrusted strings or loads remote scripts with
  private evidence in the page.
- A video/storyboard is called a rendered, reviewed video without inspection.
- The skill shifts tool work to the reader, or insists on its style despite the
  user's exact format request.

## Non-goals

No diagnosis guarantee, automated truth scoring, certified STE output, global
permission change, background agent, or promise to reduce every answer's length.
Do not claim better results without publishing the comparison and its failures.