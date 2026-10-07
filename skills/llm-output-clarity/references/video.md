# Bespoke explainer video

Karpathy's most ambitious suggestion is a tailored explanation with visuals and
narration. Use it when motion or gradual construction materially helps learning,
or when the user explicitly wants a video. It is not the default for debugging.

## Before rendering

Confirm the audience, language, duration, desired deliverable, and local versus
cloud processing when these are not already clear. Agree on dependencies and
cost before installing packages or calling paid services. Do not request API
keys in chat: the user configures them directly in their environment or vault.

No runtime, TTS engine, voice model, API integration, or renderer is bundled with
this skill. Prefer an existing local toolchain. Manim is an option for mathematical
or diagram animation; HTML scene recording is an option for interface walkthroughs.
Check the installed tool versions before writing commands for them.

## Procedure

1. Write a short script with one claim per scene. Keep qualifications in the
   narration and captions, not only in small-print credits. For an analysis,
   distinguish observed behavior from a hypothetical mechanism.
2. Produce a storyboard before expensive rendering. Include the visual, narration,
   and source or assumption for each scene. Get agreement when the scope is not
   settled. Do not imitate a real person's identity or clone a voice.
3. Build a low-resolution preview. Use a permitted local voice, user-authorized
   cloud narration, or captions-only output. Never upload private inputs or
   narration text to a service without authorization.
4. Measure the actual audio duration and align each scene to it. Use captions in
   the chosen language. Preserve symbols, numbers, negation, and units in speech.
5. Render and inspect the complete video: first and last frames, representative
   scene frames, duration, audio synchronization, captions, and cropped text.
   Report checks that could not be performed. File existence alone is not review.
6. Deliver the video plus captions, transcript, and reproducible render instructions.
   Keep the main conclusion accessible as text. Do not publish automatically.

## Honest fallback

If tools, consent, or budget are missing, provide the script and storyboard and
label them as such. An HTML animation or storyboard is not an MP4. Do not silently
substitute one for a requested video or claim that a render succeeded.