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

- The site is BuildMyCat (still "BMC"): a cat adoption house in the same ivory and gold luxury style, with a joke kitten configurator that ends on a real cat to adopt.
- Use public leaf routes for heritage, configurator, studio and passport, with shared chrome in the root; each shareable surface requires independent metadata.
- Kittens are drawn in SVG by `src/components/atelier/cat.tsx`; content lives in `src/components/atelier/data.ts` and `platform.ts`. There are no photographs.
- Keep brand visual roles and swatches in the global CSS design system.
- The studio and passport are explicitly illustrative design studies, not real adoptions; never present their example content as real data.
