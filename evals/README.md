# Evaluation protocol

**No model-quality result is claimed in version 0.1.** The repository includes
fixtures and tested bookkeeping, not evidence that a skill improves reasoning.

## What is measured

Compare four conditions on the same task:

1. `baseline`: no additional style instruction.
2. `concise`: one short clarity instruction, a deliberately strong simple control.
3. `upstream`: a reviewed, pinned local copy of the reference skill.
4. `candidate`: this skill and its language/format references, excluding examples.

The bundled examples deliberately resemble some regression cases. They are excluded
from candidate injection to reduce direct example leakage. The public cases still
influence development and are not a hidden test set. Add a held-out set before
making general superiority claims.

This protocol tests **single-turn expression with supplied evidence and no tools**.
It cannot measure actual code edits, tool execution, session persistence, rendered
artifacts, or native host activation. All reports of executed checks must come
from supplied input. Run separate real-host tests for those other capabilities.

## Prepare a run

Node.js 22+; no model SDK or key is needed for these commands. Obtain a reviewed
upstream skill yourself and record its source commit and license. The tool never
downloads or executes an upstream repository.

```sh
node scripts/evaluate.mjs validate
node scripts/evaluate.mjs prepare --upstream /path/to/upstream-SKILL.md --out /path/to/new-run --trials 3
```

Use an existing parent directory and a **new** output directory; existing runs
are not overwritten. Windows paths can use `C:/path/to/...`. The tool writes:

- `manifest.json`: run identifier, hashes, conditions, loaded resources, scope.
- `cases.json`: an immutable-by-convention snapshot checked again before blinding.
- `requests.jsonl`: one request per case, trial, and condition.

Twenty cases times three trials times four conditions produces 240 requests.
This count is not a recommended spending limit. Set a budget before any model run.

Regression cases include source attribution, conflicting reports, a diagnosis
revised by new evidence, strict JSON output, and severity-first review findings.
They specify expected behavior; adding them does not demonstrate model compliance.

The five bundled fixture languages are sample coverage, not a supported-language
allowlist. New cases can use any well-formed language tag accepted by `Intl.Locale`,
for example `fr`, `pt-BR`, or `zh-Hant`. Validation preserves the submitted tag;
it does not assess proficiency or whether the prompt is in that language. Supply
natural prompts and arrange fluent review before publishing language-quality claims.

## Collect responses with your chosen runner

No runner is bundled or automatically launched. Use a provider/host you are
authorized to call, with tools disabled for **all** conditions. Deliver each
`instruction` as additional instruction context and its `prompt` as the task.
Each request needs a fresh conversation. Shuffle execution order to reduce
time-related bias. Keep model, system prompt, sampling, reasoning effort, tool
policy, and output limit identical; use a sufficient output limit, not one that
artificially truncates a condition.

Use an isolated configuration so personal skills, hooks, memory, and styles do
not leak into baseline. Archive the runner configuration under the run directory.
Use a digest of that configuration for `settings_id`. Instruction placement and
the inclusion of all candidate reference guides can affect results and overhead;
this is not a simulation of native progressive loading. Report that limitation.

Write one JSON object per line to a response file:

```json
{"run_id":"from-request","case_id":"en-authentication","trial":1,"condition":"candidate","status":"ok","response":"Actual response text","metadata":{"model":"exact-model-version","host":"runner-name","host_version":"version","settings_id":"config-digest"},"input_tokens":null,"output_tokens":null}
```

Copy request identifiers exactly. Record actual token counts if available; otherwise
use `null` or omit them. Do not estimate model tokens from characters. A failed
generation stays in your raw log. Resolve or report it before comparison; incomplete
runs are rejected rather than silently dropping hard cases. Preserve retries and
billing separately; this tool does not calculate total provider cost.

## Blind and review

```sh
node scripts/evaluate.mjs blind --run /path/to/new-run --responses /path/to/responses.jsonl --out /path/to/new-blind
```

The command checks coverage, identifiers, hashes, and matching model/host/settings.
It shuffles responses and assigns random identifiers. Give reviewers only
`packets.jsonl` and [rubric](./rubric.md). Keep `private-key.json` separate: it
contains condition names, metadata, and responses. Labels are hidden structurally,
but a response's writing style can still reveal the condition; blinding is imperfect.

Fluent human reviewers are preferred for each language. If using model judges,
disclose model/version and compare with human judgments; self-grading is not
independent evidence. Do not send private cases to a cloud judge without consent.

Each score row must follow this shape:

```json
{"blind_id":"from-packet","fidelity":5,"grounding":5,"completeness":4,"readability":4,"actionability":4,"meaning_changed":false,"unsupported_claim":false,"critical_omission":false,"unauthorized_action":false,"notes":"Specific reason and an excerpt supporting the rating."}
```

```sh
node scripts/evaluate.mjs score --key /path/to/new-blind/private-key.json --scores /path/to/scores.jsonl
```

Scores are 1-5. All blocker flags and a rationale are mandatory. The summary keeps
dimension means, blocker counts, character lengths, and recorded token totals
separate. Unknown usage remains `null`. It deliberately does not declare a winner.

## Decide whether the change helps

Inspect blocking errors before readability gains. Do not trade a false root cause
or lost warning for fewer words. Compare per case and per language, not just an
aggregate. Have a reader answer each case's comprehension questions; measure time
to a correct answer only with a defined human protocol, not a model's estimate.

Repeat runs, report variation, and publish failures. A zero-blocker observed run
does not establish zero risk. A small test set cannot establish universal benefit.
If the concise control performs as well, prefer the simpler approach.

## Real-host checks, separate from offline scoring

- Verify discovery, explicit activation, and stop behavior in a fresh conversation.
- Check which resources the host actually loaded.
- Test a tool-enabled task in an isolated workspace; do not score tool execution
  when tools are absent.
- Inspect diagram rendering, desktop/mobile HTML, and video synchronization if
  those formats are claimed as tested.
- Record operating system, host version, model, language, and result in
  [validation status](../docs/validation.md).