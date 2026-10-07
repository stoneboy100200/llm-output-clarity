# LLM Output Clarity - A Karpathy-Inspired Agent Skill

**Understand the answer. Inspect the evidence. Know what to do next.**

[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

[Installation](./docs/installation.md) | [Design](./docs/design.md) | [Evaluation](./evals/README.md)

Turn dense AI explanations into clear writing, diagrams, interactive HTML, or
bespoke explainer videos. Choose the format that helps the reader, not the one
that looks most elaborate. Preserve evidence, uncertainty, and necessary detail.

Inspired by [Andrej Karpathy's October 2, 2026 post](https://x.com/karpathy/status/2105819303471976479)
on understanding language-model outputs, including his "80%" ASD-STE100 suggestion.
Independent project; not affiliated with or endorsed by Karpathy or ASD.
This is not an ASD-STE100 compliance tool or a fact checker.

## Why this exists

As agents do more work, the reader's job shifts toward understanding, checking,
and deciding. Shorter answers alone do not solve that problem: a short answer
can still hide an assumption or turn a guess into a fact.

This skill keeps the original route available:

| Form | Use it when | What is included |
| --- | --- | --- |
| Clear writing | A conclusion or explanation is enough | Language-aware writing and evidence rules |
| Diagrams and images | Relationships or spatial structure matter | Diagram selection, uncertainty labels, text fallback |
| Interactive HTML | The reader benefits from changing a value or opening detail | Offline-first, accessible artifact guidance |
| Explainer video | Motion and narration help teach the mechanism | Storyboard-to-render workflow and honest fallback |

The last two require user agreement or an explicit request. No browser, renderer,
voice model, or paid service is installed by this skill.

## Before and after

Synthetic input: three of twenty requests returned HTTP 429. The gateway and
downstream service can both rate-limit. Response headers are unavailable.

**Misleading:** "The gateway quota is too low. Increase concurrency."

**Clearer:** "Do not increase concurrency yet. Three requests returned 429, but
the limiting service is unknown. Check the failed requests' response headers and
correlated logs before choosing a quota or concurrency change."

This is an authored example, not a measured model result. See more
[multilingual examples](./skills/llm-output-clarity/references/examples.md).

The rules also preserve source attribution, revise a hypothesis when new evidence
arrives, and honor exact formats such as JSON-only responses. A code review still
starts with prioritized findings; clarity is not a fixed template for every task.

## Install

Install directly from the GitHub repository:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy
```

One standard Agent Skills folder serves Claude Code, Codex, Cursor, Gemini CLI,
OpenCode, GitHub Copilot, and other hosts supported by the installer. Skills CLI
detects installed tools and prompts for selection when needed; review the targets
in its summary. For unattended installs, specify `--agent` explicitly instead of
relying on detection. Do not use `--all` as a shortcut for choosing your tools.

The external Skills CLI needs Node.js, network access, and permission to write to
your skill directory. It may collect installation telemetry; see its
[documentation](https://github.com/vercel-labs/skills#telemetry).

To target specific tools, append one or more identifiers. For example:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy --agent claude-code codex
```

See [installation](./docs/installation.md) for other identifiers, manual locations,
and host checks. Installer support is not a claim of tested behavior on every host.

No `npm install` is needed to use the skill. For offline/manual installation,
project scope, updates, removal, host verification, and optional persistent
preferences, see [installation](./docs/installation.md).

The source is [stoneboy100200/llm-output-clarity](https://github.com/stoneboy100200/llm-output-clarity).
To install a reviewed local checkout instead, replace `stoneboy100200/llm-output-clarity`
with `.` and run from its root. There is no published npm package to install.

## Use

After installation, ask for the skill by name without depending on a command prefix:

```text
Use llm-output-clarity to explain this failure. Separate observations from hypotheses.
Use llm-output-clarity to compare these two options. Give the recommendation, evidence, and risks.
Use llm-output-clarity to explain the request flow with a diagram.
Use llm-output-clarity to make an offline HTML explainer with a before/after toggle.
Use llm-output-clarity to plan a narrated explainer video. Do not install anything yet.
```

Explicit shortcuts differ: Claude Code uses `/llm-output-clarity`, Codex uses
`$llm-output-clarity`, and Copilot uses `/llm-output-clarity`. For other tools, use
their skill menu or documented invocation method. The host must load the skill;
a plain model API does not discover local files automatically. On hosts that
support implicit skill selection, relevant explanation/analysis requests may
activate it automatically; this is a model decision, not a guaranteed hook.

Default scope is the current request. Ask "Use this skill for the rest of this
session" to request session mode. "Stop clarity mode" asks the agent not to
reactivate it in that conversation until you request it again. A new conversation
uses the host's discovery rules; no persistent on/off state is stored. Compaction
can weaken adherence. These are instructions, not a software-enforced switch.
Installation does not make it always-on or change any other installed skill.

## Verify, update, and remove

```sh
npx skills list --global
```

Then check the skill list or settings in your chosen host; reload or start a new
session when necessary. An installer record does not prove host discovery, and
discovery does not prove behavior. Try a small task with an unknown cause and
inspect the answer. Host-specific checks are in the installation guide.

For a local install, review changes in your source copy and repeat the install
command. Back up local customizations before replacement. Remote update behavior
is covered in [installation](./docs/installation.md).

To remove a Skills CLI-managed user installation:

```sh
npx skills remove llm-output-clarity --global
```

Without `--agent`, removal may clean this skill from multiple hosts. Append the
intended `--agent` to limit removal to a tool, and review the scope before confirming.

For manual installs, remove only the `llm-output-clarity` directory, not other
skills. Remove any optional persistent preference separately and start a new chat.

## Languages and limitations

**Output is not limited to five languages.** The instructions are in English;
answers follow the requested language, with no language allowlist. French,
German, Portuguese, and other languages depend on the model's proficiency and
remain unvalidated here. The skill
does not impose English word counts or tense restrictions on other languages.
Chinese, English, Spanish, Japanese, and Arabic synthetic fixtures are included.
Fixture coverage is **not** validated fluency. See
[language guidance](./skills/llm-output-clarity/references/language.md).

README editions cover English, Simplified Chinese, Japanese, Spanish, and Arabic.
Translations are initial drafts pending fluent human review. The English README
is the maintenance source; linked advanced guides are currently in English.
Translated documentation does not establish model quality in that language.

- Clear phrasing cannot prove that a diagnosis is correct.
- Host discovery, instruction loading, behavioral compliance, and language
  quality are different things. Test them separately.
- HTML/video generation depends on the agent's tools; only workflows are bundled.
- Do not enable several conflicting always-on output styles at once.
- No comparative superiority or cost reduction has been established. See
  [validation status](./docs/validation.md).

## Why not strict STE by default?

Strict ASD-STE100 governs English technical writing through writing rules, a
controlled dictionary, and domain terminology. It can reduce ambiguity; it does
not establish factual or diagnostic correctness and is not a grammar for other
languages. Karpathy explicitly notes sometimes relaxing the specification to
"80% of the way" because it is stringent. That is a style preference, not a score.

We borrow the clarity principles by default while preserving conditions,
exceptions, and uncertainty. You can request more constrained STE-style English
for procedures, but model memory is not proof of full compliance. Formal work
requires review against the applicable standard, dictionary, and project glossary.
No ASD standard, dictionary, or strict-compliance certification mode is bundled.

## Develop and evaluate

Development only: Node.js 22+ and npm. The YAML parser is a locked development
dependency. The skill itself is Markdown with no executable runtime dependencies.

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run eval:validate
```

The evaluation utilities prepare comparable prompts and blinded review packets.
They do not call a model, upload data, or spend API credits. See
[the evaluation protocol](./evals/README.md) before interpreting results.

## Open-source status

MIT. Adaptation credits and retained upstream notices are in
[LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES](./THIRD_PARTY_NOTICES.md).
ASD's specification and controlled dictionary are not included.

Contributions should add a failing example before a new rule. Start with
[CONTRIBUTING](./CONTRIBUTING.md); use only synthetic or explicitly public data.
See [SECURITY](./SECURITY.md) and the [publication checklist](./docs/publishing.md).