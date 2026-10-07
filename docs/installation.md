# Install, activate, update, remove

## Recommended: use the existing Skills CLI

Install directly from the GitHub source:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy
```

This is one portable Agent Skills folder, not a different implementation per
platform. The external installer detects supported tools and offers a selection
when needed. Review the destinations in its summary; interactive choices depend
on the installer version, detected tools, and environment. In automation or an
agent-managed terminal, use explicit `--agent` targets rather than trusting
auto-detection. The installer may use non-interactive defaults in that environment.

`--copy` avoids Windows symlink privileges. Do not use `--all`: it selects every
skill and agent without prompts, not just the tools you use. To preview available
skills without installing, run `npx skills add stoneboy100200/llm-output-clarity --list`.

Omit `--global` for a project install and run from the destination project.
To use a reviewed local checkout, replace the repository identifier with its
absolute path, or with `.` when running from the checkout's root. The external
installer needs Node.js, network access, and write permission; using the installed
Markdown skill needs none of this project's development dependencies.

## Select tools only when you need to

The generic command is the main entry point. To restrict it, append one or more
identifiers. For example, to select Claude Code and Codex:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy --agent claude-code codex
```

Common identifiers and personal skill locations are listed below. These are
installation routes from the [Skills CLI documentation](https://github.com/vercel-labs/skills#supported-agents),
not claims that every listed host or model passed our behavior tests.

| Tool | `--agent` identifier | Personal skill parent directory |
| --- | --- | --- |
| Claude Code | `claude-code` | `~/.claude/skills/` |
| Codex | `codex` | `~/.agents/skills/` |
| Cursor | `cursor` | `~/.cursor/skills/` |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills/` |
| OpenCode | `opencode` | `~/.config/opencode/skills/` |
| GitHub Copilot (VS Code and CLI) | `github-copilot` | `~/.copilot/skills/` |
| Cline | `cline` | `~/.agents/skills/` |
| Windsurf | `windsurf` | `~/.codeium/windsurf/skills/` |

Some installer versions use a shared canonical copy or another path that the host
supports. Inspect the installer output and host settings, including any custom
configuration-directory overrides. Do not assume every host scans the same user
directory, and do not create duplicate copies of the same skill in several paths
scanned by one host. Use the installer's current list for other supported tools.

An installation route is not a model dependency. The host loads the instructions;
its chosen model follows them. A plain model API does not automatically discover
skills on your disk. If your application uses an API directly, it must supply the
instructions and required references itself within its normal permission policy.

## Network and privacy

The external installer may send install telemetry. To opt out for a PowerShell
session before running it:

```powershell
$env:DISABLE_TELEMETRY = '1'
```

POSIX shells can prefix the command with `DISABLE_TELEMETRY=1`.
This project has no telemetry, lifecycle hooks, or remote bootstrap scripts.

The canonical source is
[stoneboy100200/llm-output-clarity](https://github.com/stoneboy100200/llm-output-clarity).
For reproducible installs, review and use a checkout pinned to a specific commit.

## Manual/offline installation

Copy the **whole** `skills/llm-output-clarity` directory, including `references`
and `LICENSE`, into the personal parent directory for your chosen tool. The
result must be `<parent>/llm-output-clarity/SKILL.md`. Copying only the entry file
loses required references and license notices.

For example, from the project root in PowerShell, for Claude Code:

```powershell
$destination = Join-Path $HOME '.claude/skills/llm-output-clarity'
if (Test-Path $destination) { throw 'Skill already exists. Review it before replacing.' }
New-Item -ItemType Directory -Force (Split-Path $destination) | Out-Null
Copy-Item './skills/llm-output-clarity' $destination -Recurse
```

For Codex, use `.agents/skills/llm-output-clarity` instead. Use the appropriate
parent from the table for other tools. On macOS/Linux, create that parent, check
that the destination does not exist, and copy with your file manager or `cp -R`.
The manual route requires no npm, network, administrator access, or runtime.

## Verify discovery separately from behavior

First inspect the installer inventory:

```sh
npx skills list --global
```

Then verify the **host** can see the skill. Commands are entered in the host's
chat unless explicitly marked as terminal commands.

| Tool | Find or refresh | Explicit invocation |
| --- | --- | --- |
| Claude Code | `/skills`; start a new session if the entry is missing | `/llm-output-clarity` |
| Codex CLI / IDE | `/skills`, or type `$` to select the skill; restart if needed | `$llm-output-clarity` |
| Copilot CLI | Terminal: `copilot skill list`; chat: `/skills reload` and `/skills info llm-output-clarity` | `/llm-output-clarity` |
| VS Code Copilot | Chat's Agent Customizations, then Skills, in the intended harness | `/llm-output-clarity` |
| Cursor, Gemini CLI, OpenCode, Cline, Windsurf | The tool's documented skill list/settings or resource inspection | Ask by name or use its supported skill selector |

There is no universal slash command. The general request below avoids a
platform-specific prefix, but still requires the host to have discovered the skill:

```text
Use the llm-output-clarity skill to explain this result in my language.
```

If discovery fails, check directory names, enabled skills, trust or organization
policies, and the host version. Installation inventory, discovery, resource
loading, and behavioral compliance are separate checks. Appearance in a menu
does not prove the skill was loaded for an answer.

For a behavior smoke test, ask in your language:

```text
Use llm-output-clarity. Supplied facts: two requests timed out. No server logs
were checked. Give a short analysis. Do not use tools or invent a root cause.
```

Check that the response preserves the missing evidence and offers a reasonable
next check without claiming it ran. Repeat without invoking the skill to compare.
This is a smoke test, not proof of improved reliability.

## Automatic, request, and session activation

The core uses the portable Agent Skills fields and allows host-driven selection.
Its description covers explanation, analysis, simplification, and comparison.
It does not run in the background, on save, or on a schedule.

- Explicit invocation is the most predictable entry point.
- Implicit invocation depends on the host, model, description, and enabled tools.
- Default duration is one request. Session mode must be requested and can be stopped.
- After an opt-out, the skill instructs the agent not to implicitly reactivate it
  in that conversation until requested again. This is not a programmatic toggle;
  adherence can weaken after compaction or with conflicting instructions.
- A new session does not inherit mode from this skill. No state file or hook exists.

Manual-only controls are host-specific, not a universal frontmatter switch:

- Claude Code and supporting Copilot versions: add `disable-model-invocation: true`
  to the **installed copy's** frontmatter or use the host's supported visibility controls.
- Codex: use the optional `agents/openai.yaml` file inside the installed skill:

```yaml
policy:
  allow_implicit_invocation: false
```

Preserve existing metadata when merging this setting. Other hosts have their own
controls; consult their documentation. These overrides are not shipped in the
portable default, and replacing an installed copy can overwrite local changes.

## Optional persistent preference

The short [preference snippet](../integrations/clarity-preference.md) can be merged
into an instruction location supported by your host. It is a small standalone
preference, not a guarantee the full skill will load each turn.

- Claude Code: merge into a supported personal instruction location such as
  `~/.claude/CLAUDE.md`, preserving existing content.
- Codex: merge into a supported personal instruction location such as
  `~/.codex/AGENTS.md`, preserving existing content and configuration overrides.
- Copilot CLI: merge into `~/.copilot/copilot-instructions.md` (or the corresponding
  file under `COPILOT_HOME` when configured).
- VS Code Copilot Agent Host: the same personal file is documented; verify the
  selected harness. For the Local agent, use Chat: New Instructions File in the
  user profile, or merge into a workspace instruction file.
- Shared workspace: `.github/copilot-instructions.md` works for supported Copilot
  sessions, but affects other collaborators. Do not overwrite existing guidance.
- Other hosts: use the tool's documented user rules or instructions. There is no
  single always-on file location shared by all tools.

An `applyTo` glob controls file-related activation; it is not a universal guarantee
for all pure-chat requests. Inspect the host's loaded references to verify behavior.
Persistent preferences are a separate opt-in edit. Installing this skill does not
make that edit. Remove the snippet to disable it across future sessions.

Avoid competing always-on styles. Existing `i-have-adhd` or STE skills can stay
installed; select one primary style for a task, and resolve conflicts explicitly.

## Update and remove

For a published remote installation managed by Skills CLI:

```sh
npx skills update llm-output-clarity --global
npx skills remove llm-output-clarity --global
```

Review the affected destinations. Without `--agent`, removal may clean this skill
from multiple hosts. To remove it only from selected tools, for example:

```sh
npx skills remove llm-output-clarity --global --agent claude-code codex
```

For a local/manual installation, review changes in the source and replace only
the installed skill directory after backing up local customizations. To uninstall,
remove only that directory. Remove any preference snippet separately. Do not
remove the containing skills folder or unrelated skills.

Start a new conversation after removal: instructions already loaded into an
existing conversation may still influence it.

## Official references

- [Skills CLI and supported agents](https://github.com/vercel-labs/skills)
- [Agent Skills format](https://agentskills.io/specification)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Codex Skills](https://learn.chatgpt.com/docs/build-skills)
- [Cursor Skills](https://cursor.com/docs/context/skills)
- [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)
- [OpenCode Skills](https://opencode.ai/docs/skills)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Copilot CLI Skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-skills)
- [Copilot CLI Instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [VS Code Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)