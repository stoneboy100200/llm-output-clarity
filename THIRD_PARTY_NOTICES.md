# Attribution and third-party notices

## Inspiration is not endorsement

[Andrej Karpathy's October 2, 2026 post](https://x.com/karpathy/status/2105819303471976479)
motivates the writing / diagrams / interactive HTML / bespoke video route and
the focus on human understanding and oversight. The project is independent and
does not imply his participation, approval, or endorsement.

ASD-STE100 and Simplified Technical English belong to ASD. This project borrows
general clarity principles, does not include the specification or controlled
dictionary, and does not certify compliance. Consult [ASD](https://www.asd-ste100.org/)
for the authoritative standard. "80%" is an informal inspiration, not a score.

## Adaptation credits

Core guidance was written with reference to the MIT-licensed
[prithivrajmu/asd-ste100](https://github.com/prithivrajmu/asd-ste100) skill, including
its preservation of facts and uncertainty and its multilingual output guardrails.
That project credits [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill).
Their copyright and permission notices are retained in [LICENSE](./LICENSE).

Reviewed upstream snapshot during design: prithivrajmu/asd-ste100 commit
`577fc0184c7ed64a6d4e8c9005ca60bcf328eae5` (source pages reviewed 2026-10-07).
The new skill is not a verbatim distribution of that repository or its examples.

Additional design comparisons, not bundled implementations:

- [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd): readable response structure.
- [dualface/ste-zh](https://github.com/dualface/ste-zh): Chinese reporting and verification labels.
- [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer): visual explanation workflows.
- [ajithraghavan/make-it-click](https://github.com/ajithraghavan/make-it-click): format selection and oversight.
- [vercel-labs/skills](https://github.com/vercel-labs/skills): installation is delegated to its existing CLI.

No upstream browser/video renderer, checker, or installer is vendored. The `yaml`
development dependency retains its own license through npm; it is not needed
when using the Markdown skill.