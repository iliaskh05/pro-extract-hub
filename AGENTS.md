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

- The build-time sitemap generator uses the same default public origin as `siteUrl()` when no environment override is supplied, so publishing cannot produce relative sitemap URLs.
- Sitemap lastmod values must come from authoritative page-specific content timestamps; omit them when none exist to avoid claiming every build changed every page.
