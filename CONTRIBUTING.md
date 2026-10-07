# Contributing

Keep the core small. A new rule should fix a reproducible failure, not merely
express a stylistic preference.

1. Describe the reader's task and the observed failure with synthetic or public data.
2. Add a case with facts that must survive, forbidden changes, and comprehension questions.
3. Make the smallest instruction change. Put specialist guidance in references.
4. Run the package checks and tests. Run controlled model comparisons separately
   before claiming a behavioral improvement.
5. Document limitations and update all README translations when behavior changes.
   English is the maintenance source. Preserve commands, activation scope,
   uncertainty, and validation caveats across translations. Label translations
   as drafts until a fluent human reviewer has checked them.

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run eval:validate
```

Language contributions need fluent review. Preserve code, citations, negation,
units, and confidence in translations. Include the language's own failure modes
instead of translating English grammar restrictions verbatim.

Keep the English README's usage instructions in English. Native language names
in its navigation are intentional; multilingual demonstrations belong in the
dedicated examples or translated READMEs. The script-based regression check is
a narrow guard against mixed examples, not a language detector or translation review.

Never commit tokens, private code, production logs, customer data, or proprietary
prompts. Do not copy ASD's specification or dictionary. Preserve applicable MIT
notices when adapting upstream content. See [third-party notices](./THIRD_PARTY_NOTICES.md).