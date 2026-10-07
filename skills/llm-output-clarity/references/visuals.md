# Diagrams, images, and interactive HTML

The goal is to reveal a mechanism that prose makes hard to hold in mind. A
visual is not automatically easier to understand, and appearance is not evidence.

## Diagram procedure

1. Identify the one question the figure answers. Select a sequence diagram for
   interactions over time, a flowchart for branches, or a dependency diagram for
   relationships. Prefer a table for a small same-criteria comparison.
2. List the supported actors, edges, conditions, and exclusions before drawing.
   Mark hypothetical edges explicitly with words as well as a different line.
   Do not turn mere co-occurrence into a causal arrow.
3. Use Mermaid when the host renders it; use SVG when precise spatial placement
   is important. On a text-only terminal, give a readable outline or a local file
   instead of a wall of unrendered diagram syntax, unless source was requested.
4. Keep names identical in the figure and prose. Label edges with actions and
   relevant conditions. Split dense figures without losing cross-figure links.
5. Give one takeaway and a text equivalent. Verify syntax with an available
   renderer. State explicitly when visual rendering was not checked.

Images can help identify a real object or spatial relationship. A generated
illustration is not a screenshot, measurement, or record of an actual event.
Label synthetic images and do not use them as diagnostic evidence.

## Interactive HTML procedure

Create HTML when requested, or after agreement when a visual interaction would
answer the question better. A comparison toggle, filter, state stepper, or small
simulation should expose something the reader could not easily see in prose.

- Agree on an output path or use a unique local temporary filename. Do not
  overwrite an existing report. Deliver the local path; do not publish or upload.
- Prefer one offline file with inline CSS, JavaScript, and diagrams. Use local
  fonts. No analytics, remote fonts, or third-party scripts by default. Ask before
  adding network dependencies, especially for private code or internal evidence.
- Do not include secrets. Treat text, JSON, and labels from inputs as untrusted.
  Use `textContent`, not `innerHTML`, for data. When embedding JSON in a script
  element, escape `<` as `\u003c` so data cannot close the element. Do not `eval`
  user content or turn extracted strings into event handlers.
- Put the conclusion and its important qualification first. Group evidence by
  the claim it supports. Use expandable detail without hiding critical warnings.
- Label simulations and hypothetical values. Preserve units and assumptions;
  changing a slider is not a new measurement of the real system.
- Set `lang`, and `dir` when relevant. Provide keyboard controls, visible focus,
  sufficient contrast, text labels beyond color, and reduced-motion behavior.
- Check at desktop and narrow mobile widths. Confirm labels fit, long paths do
  not expand the page, controls work, and the browser console has no new errors.
  Inspect screenshots when tools permit. If a check is unavailable, disclose it.
- Keep a short text answer in chat: the conclusion, important limit, and artifact
  location. Do not force the reader to open a webpage to learn the result.

## If tools are missing

Deliver a diagram source or a static explanation and name what remains untested.
Do not install a browser, dependency, or service merely because this skill mentions
one. Respect the user's installation permissions and the host's approval policy.