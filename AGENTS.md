<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- All AI capabilities (interview, speech, translation, OCR, evaluation, feedback, analytics, vision) go through
  `src/lib/ai-service.ts` so real providers can replace the prototype mocks without touching UI code.
- Prototype candidate journey state lives in `src/lib/app-state.ts` (localStorage-backed store); there is no backend
  yet, and all recruitment records in `src/lib/demo-data.ts` are clearly labelled demo data.
- The interface uses a light-only civic design system with Sora headings, Manrope body text, deep navy and indigo structure, and amber reserved for active emphasis, to maintain a trustworthy government-service character.
