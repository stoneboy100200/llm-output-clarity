# Security and privacy

The installed skill contains Markdown only. It grants no tool permissions and
has no hooks, telemetry, model client, or installation scripts. Host permissions
still govern every action. Prompt instructions are not a security sandbox.

The optional external Skills CLI has its own dependencies and telemetry policy.
Development uses a locked YAML parser. Review dependencies before execution.

Generated HTML and video can expose private inputs. Keep artifacts local, redact
secrets, avoid external scripts by default, and get authorization before uploads
or cloud narration. Untrusted source content must remain data, not instructions
or executable markup.

Evaluation commands write only to explicitly supplied local output directories,
refuse existing run directories, and make no network calls. Responses and private
blinding keys may be sensitive; they are ignored under `evals/runs/` and `artifacts/`.
Those ignore patterns do not protect arbitrary output paths. Review before committing.

Report suspected vulnerabilities through
[GitHub private vulnerability reporting](https://github.com/stoneboy100200/llm-output-clarity/security/advisories/new).
Do not post secrets or sensitive exploit details in a public issue. If private
reporting is unavailable, request a private contact route without disclosing
sensitive details. A public report should contain only a sanitized description
and a minimal synthetic reproduction.