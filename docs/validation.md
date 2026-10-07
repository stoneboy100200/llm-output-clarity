# Validation status

This document distinguishes packaging checks from behavioral and language claims.
No result below implies that a diagnosis is correct or that this skill beats a
reference skill. Update measured items only after running the named check.

## Current evidence

| Check | Status |
| --- | --- |
| Skills CLI discovers the canonical skill | Refreshed locally on Windows, 2026-10-07: --list found the skill; no host install or execution |
| Automated tests | 20 passed locally, including platform-neutral README checks, extensible language tags, and offline CLI prepare/blind/score |
| Development dependency audit | yaml 2.9.1 installed; npm reported zero known vulnerabilities |
| Full package/link checks | Passed: 130-line core, 21 Markdown documents checked |
| README navigation and command consistency | Passed across English, Simplified Chinese, Japanese, Spanish, and Arabic |
| Generic installation instructions | Primary command has no platform flag; distinct Codex invocation checked in all 5 README editions |
| Additional fixture language tags | Structural acceptance tested for fr, de, pt-BR, ko, hi, he, zh-Hant, sr-Latn-RS; no model-quality inference |
| Copilot CLI discovery after isolated install | Pre-review snapshot passed with Copilot CLI 1.0.83-0 and Skills CLI 1.7.0 on Windows |
| Installation file integrity | All 7 files of the pre-review installed snapshot matched its source byte-for-byte, including license |
| npm archive preview | Refreshed after this review: all 5 README editions included; no node_modules or run outputs; not published |
| Clean development install from lockfile/cache | Passed with npm ci --ignore-scripts --offline --no-audit |
| VS Code UI discovery and behavior | Not tested for this new skill |
| Claude Code / Codex execution | Not tested |
| Linux / macOS CI | Workflow provided; not run locally |
| Model-output comparison | Not run; no provider calls made |
| Fluent multilingual review | Not performed |
| Generated HTML / diagram / video quality | Not tested; this release bundles guidance, not rendered demos |

The review changed the source skill and documentation, not installed user copies.
Previous installation checks are historical evidence, not a behavioral test of
the revised instructions. Native host activation and model output need separate
fresh-session tests before stronger compatibility or quality claims.

The development dependency was downloaded through the host's configured mirror.
The public lockfile uses the canonical npm URL and the same integrity digest.
Direct public npm requests failed with a TLS handshake error on this machine;
public-network development installation is not verified. No TLS verification was
disabled. Users of the Markdown skill do not need the development dependency.

## Fixture coverage is not fluency

There are 20 synthetic task fixtures. English and Chinese have several; Spanish,
Japanese, and Arabic have small smoke fixtures. New cases cover source attribution,
evidence-driven revision, JSON-only output, and severity-first review ordering.
None of these has been run as a model comparison. They are authoring targets,
not native speaker review or statistical evidence.

All five README editions include installation, activation, removal, and limitations.
Translations are drafts pending fluent human review. Automated navigation and
command checks cannot assess semantic equivalence or naturalness. The linked
advanced guides remain English. Multilingual adaptation is an intended capability,
not a certification.

The five documentation and fixture languages are not an output-language allowlist.
Other requested languages depend on the model's proficiency. The evaluation
validator accepts well-formed language tags through Intl.Locale, rather than a
fixed list, so contributors can add cases without changing the evaluator.

## STE scope

The default uses STE-inspired clarity, not strict ASD-STE100 compliance. Tighter
STE-style English can be requested, but no complete standard/dictionary checker
is bundled. Grammar constraints do not validate factual claims. The README
explains Karpathy's optional "80%" relaxation and the distinction between English
compliance and multilingual clarity. No new strict-compliance mode was certified.

## Known limits

- Models can ignore instructions, especially under context pressure or conflicts.
- Implicit activation depends on the host and model. Session mode is conversational,
  not a durable state machine.
- The quality protocol supplies evidence with tools off. It cannot establish
  autonomous debugging or secure browser behavior.
- Static checks validate structure, not truth, semantics, or real comprehension.
- Artifacts need compatible tools and independent rendering/accessibility checks.
- No name, trademark, domain, or repository availability clearance has been done.