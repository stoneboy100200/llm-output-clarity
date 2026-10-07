# Before publishing

The canonical source is
[stoneboy100200/llm-output-clarity](https://github.com/stoneboy100200/llm-output-clarity).
This checklist applies before each public push or release. The project does not
publish an npm package or change users' global agent settings automatically.

## Release checklist

- Confirm ownership and permission to publish work created in your environment.
  Use only public/synthetic examples; scan the complete release archive for
  credentials, private paths, organizational details, and proprietary material.
- Verify the intended owner and repository URL. Keep the remote installation
  commands in every README language consistent; test them after publishing.
- Review [LICENSE](../LICENSE) and [third-party notices](../THIRD_PARTY_NOTICES.md).
  Confirm contributor naming and any employer requirements. Do not imply ASD or
  Karpathy endorsement or certify STE compliance.
- Run `npm ci --ignore-scripts`, `npm run check`, `npm test`, and
  `npm run eval:validate`. Review `npm pack --dry-run` output. The npm manifest
  is private to prevent accidental npm publication; GitHub Skills installation
  does not require publishing to npm.
  Develop from a Git checkout, not an npm archive: npm excludes package-lock.json
  from its tarball, while the repository retains it for reproducible npm ci.
- Verify install, update, removal, resource loading, and a behavior smoke test on
  each host you claim to support. Record OS and versions. GitHub CI is not run
  until the repository is pushed and Actions are permitted.
- Review multilingual examples with fluent speakers. Run the comparison protocol
  before claiming quality/cost gains. Publish failures as well as averages.
- Enable a private security reporting channel and update [SECURITY](../SECURITY.md).
- Publish a tagged, reviewed version and release notes. Do not change users'
  installed skills or always-on instructions without an explicit update.

## Suggested repository description

Karpathy-inspired agent skill for clear multilingual LLM outputs: STE-inspired
writing, diagrams, interactive HTML, and explainer-video workflows, with evidence
and uncertainty preserved.

Suggested topics: `agent-skills`, `llm`, `technical-writing`, `multilingual`,
`simplified-technical-english`, `github-copilot`, `diagrams`, `explainability`.
These describe intended scope; they are not verified compatibility badges.