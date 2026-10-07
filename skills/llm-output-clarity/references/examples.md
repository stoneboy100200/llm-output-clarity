# Synthetic examples

These examples demonstrate intended behavior. They are written fixtures, not
model evaluation results. All names, quantities, and observations are synthetic.

## Rewrite: authentication is not necessarily login

Source: "The client must be authenticated before sending requests. Requests from
unauthenticated clients are rejected."

Clear: "Authenticate the client before it sends requests. The service rejects
requests from unauthenticated clients."

Reject: "Log in first." It may replace service credentials or an API key with a
human login and omit the rejection behavior.

## Analyze: Chinese, unknown cause

Input: "部署后有 8 个请求返回 429。没有响应头，也不知道限流来自网关还是下游。该不该增加并发？"

Answer:

> 暂不建议增加并发，先确认限流来源。
>
> 已知：部署后有 8 个请求返回 429。现有证据不能区分网关和下游限流。
>
> 下一步：检查失败请求的响应头及对应日志。来源确认后，再判断应减少并发、调整配额，还是修复请求分配。

Reject: "根因是网关配额不足，调大并发即可。" Neither the cause nor the fix is established.

## Summarize: partial success

Source: "The patch is applied. All 18 unit tests pass. Integration tests were not
run because the database is unavailable. There is no production observation."

Summary: "The patch passes 18 unit tests. Integration and production behavior
remain unverified; the database was unavailable for integration tests."

Reject: "Fixed and fully tested." Passing unit tests does not prove the incident
is resolved.

## Attribute reports, not independent verification

Source: "The vendor says its update fixes all timeouts. Our Linux staging test
still timed out once. We have not tested Windows."

Summary: "The vendor claims a fix, but one Linux staging test still timed out.
Windows remains untested. The supplied reports do not establish a fix everywhere."

Reject: "We verified that the update fails on all platforms." This invents both
independent verification and a broader tested scope.

## Update a diagnosis when evidence changes

Input: "最初只有 429，曾怀疑网关。新增完整链路显示这次 429 由 worker 返回，
原因字段是 tenant_quota；配额数值是否正确仍未检查。"

Answer: "新增链路证据将这次 429 定位到 worker，不再支持此前的网关判断。
记录的原因是 tenant_quota，但配额配置是否正确尚未确认。"

Reject: "原因仍完全未知。" Appropriate caution should not erase newly established facts.

## Honor structured output

Input: "Return JSON only with count and cause. Count is 3; cause is unknown."

Response content, without surrounding prose or a Markdown fence:

```json
{"count":3,"cause":null}
```

The fence above displays the example in this document; it is not part of the
response. Do not add an answer-first sentence or a follow-up outside the JSON.

## Translate: Spanish, preserve uncertainty

Source: "The queue may be full. We have not checked its depth."

Translation: "La cola podría estar llena. No hemos comprobado su tamaño."

Reject: "La cola está llena." Possibility became fact, and missing evidence vanished.

## Explain: Japanese, do not add certainty

Input: "ログには接続タイムアウトがあります。ネットワーク障害とは断定できますか？"

Answer: "断定できません。接続タイムアウトだけでは原因を特定できません。接続先の状態と同じ時間帯のネットワークログを確認してください。"

The answer preserves the distinction between an observed timeout and its cause.
Naturalness requires review by a fluent speaker; this fixture is not a certification.

## Decide: do not force one universal answer

Input: "An index speeds reads in our staging benchmark but slows writes. Should
we deploy it? Production write load is unknown."

Answer: "Measure production write load before deciding. The staging benchmark
supports a read benefit, but not a safe production trade-off. If writes are rare
and the read gain matters, a bounded rollout may be reasonable. Otherwise,
consider a narrower index or no change."

## Choose a format

- "What does HTTP 404 mean?" -> one or two sentences, not an HTML report.
- "Compare these three retry policies." -> a small table if criteria align.
- "Where do concurrent retries duplicate a write?" -> a sequence diagram if
  the available evidence establishes the interactions; label hypothetical paths.
- "Let me vary retry count and inspect worst-case latency." -> an agreed local
  HTML model with explicit assumptions, not an asserted production measurement.
- "Make a narrated video of how this algorithm evolves." -> storyboard, consent
  for required tools/services, preview, then rendered video if the tools exist.