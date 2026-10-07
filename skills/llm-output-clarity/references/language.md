# Language adaptation

The language of these instructions is not the required output language. Use the
user's explicit choice, otherwise the conversation's language. Preserve a source
language when the task is to edit that source rather than translate it. Do not
infer a preferred language or reading ability from a name, location, or identity.

The languages below are examples, not an allowlist. Apply the shared principles
in any requested language the model can handle; README translations and test
fixtures do not limit output languages. Do not switch to English merely because
a language has no dedicated section. Disclose a material language limitation
instead of inventing fluency or claiming that every language has been tested.

## Shared principles

- Preserve meaning and strength: obligation, permission, possibility, prediction,
  and observation are different claims. Do not collapse them into one modal verb.
- Keep terminology consistent within the answer. Preserve identifiers and useful
  technical terms; explain rather than mechanically translate them.
- Prefer sentences that expose the actor, condition, and result. Passive voice
  is acceptable when the actor is unknown or it is the natural wording.
- Do not use a universal character count, word count, reading-grade score, or
  English grammar checker as proof of clarity across languages.
- Preserve units, timezone offsets, decimal values, and logical negation. Convert
  units or localize dates only when requested or useful, with unambiguous values.
- When translating, preserve facts without endorsing them. Label a factual
  correction separately if correction is part of the requested work.

## Chinese

Use natural Chinese; avoid long chains of modifiers and unnecessary phrases such
as "对配置进行修改" when "修改配置" carries the same meaning. Split clauses when
their actors or conditions differ. Retain meaningful "可能", "尚未确认", and
"在……条件下". Do not replace uncertainty with an assertion for brevity.

Use the script the user requests. Do not silently convert a quoted traditional
Chinese message, UI label, or identifier into simplified Chinese.

## English

Borrow STE's short sentences, stable terms, and explicit instructions. Aim for
roughly 15-25 words when that helps, not a hard cap. Preserve "may have failed"
and "has completed" when they carry uncertainty or current relevance. Do not
claim approved-dictionary compliance: no ASD dictionary is bundled.

For explicitly requested STE-style English procedures, follow tighter structural
constraints where meaning survives: one action per step, a clear actor, conditions
before actions when needed, stable terms, and short sentences. Do not delete a
qualification to fit a word cap or transform a hedge into certainty. If formal
ASD-STE100 compliance is required, use the applicable authorized standard,
dictionary, and domain glossary and report unverified requirements. Model memory
and sentence-length checks alone cannot establish full compliance. Other languages
can use controlled writing principles, but are not ASD-STE100 English.

## Japanese and other CJK text

Use natural local sentence structure. Split overloaded clauses, not every phrase.
Do not force English articles, subject repetition, or tense restrictions onto
the language. Keep technical names stable and distinguish possibility from fact.

## Spanish and other inflected languages

Keep grammatical agreement and natural word order. Shortening must not erase
conditions, change a permission into an obligation, or alter a negative statement.
Allow inflected forms of the same technical term rather than demanding identical
surface spelling.

## Right-to-left text

For HTML, set the actual `lang` and `dir` on the document. Use logical CSS
properties such as `margin-inline-start`. Isolate paths, identifiers, and numbers
with `bdi` or an explicit left-to-right code span where needed. Verify mixed
direction text in the browser; never reverse strings manually.

## Honest support claims

These are adaptation guidelines, not proof of proficiency. Report the language,
model, host, and test coverage when publishing results. Ask a fluent reviewer to
assess naturalness and meaning before claiming a language is validated.