# Linewise

Vim-inspired Hugo theme for personal blogs. Posts as buffers, Vim keybindings, client-side search, Hugo-native theme distribution.

**Stack:** Hugo Extended 0.146+ (static), Hugo Pipes, vanilla TypeScript, plain CSS, pnpm, Playwright.

## Commands

```sh
pnpm dev          # Hugo server at localhost:4322
pnpm build        # build exampleSite with the local theme
pnpm test         # Playwright e2e
pnpm lint         # ESLint
pnpm format:check # Prettier
```

## Code Style

- Theme CSS lives in `assets/css/linewise.css` — custom properties, BEM-like names, no Tailwind.
- Client TS lives in `assets/ts/` and `assets/ts/modules/` (state, commands, buffers, search, keyboard, code-copy), bundled with Hugo Pipes.
- Lazy DOM refs live in `assets/ts/modules/state.ts`: `commandInput()`, `statusMetaEl()`, etc.
- Hugo templates live in `layouts/`; public override points are documented in `exampleSite/content/posts/theme-reference.md`.
- Example content and all user-facing docs live in `exampleSite/content/posts/`.
- Example site config lives in `exampleSite/hugo.toml`; theme metadata lives in `theme.toml`.
- Progressive enhancement: links/forms/content work without JS. JS enhances buffers, search, keyboard navigation, and code copy.

## Documenting Features

Major features that affect public API, config, templates, shortcodes, runtime behavior, or build output must ship with a user-facing post in `exampleSite/content/posts/`. This is the primary documentation surface for end users; do not add a separate documentation directory.

**Adding a feature post:**

1. Create a new `.md` file in `exampleSite/content/posts/` with frontmatter:

   ```md
   ---
   title: "Feature Name"
   description: "One-line summary for SEO and previews."
   date: 2026-06-14
   tags: ["reference"]
   ---
   ```

2. Keep the post useful as both documentation and example content.
3. Link to canonical docs on the example site from `README.md` when the README needs a reference.

## Example Post Order

Posts are sorted by `date` descending. Keep the example site ordered as a reader journey:

1. Welcome to Linewise
2. Getting Started with Linewise
3. Buffers, Not Tabs
4. Theme Reference
5. Customizing Linewise
6. Keybindings and Commands
7. Comments
8. Upgrading Linewise
9. Release Checklist

Use dates to preserve that order unless the theme intentionally introduces a new top-level guide.

## Tests

```sh
pnpm test
pnpm exec playwright test --ui
```

Tests live in `e2e/`. Write tests with `test.use({ viewport })` or `page.setViewportSize()` for mobile and constrained viewport scenarios. CI runs `pnpm build` and `pnpm test`.

## Commit

Run checks before committing. Confirm everything passes:

```sh
pnpm lint && pnpm format:check && pnpm build && pnpm test
```

Commit messages in English, format:

```text
<type>: <short summary>

<optional body>
```

Types:

- `fix:` bug fixes
- `feat:` new features
- `docs:` README, example posts, comments, UX spec
- `chore:` deps, config, gitignore
- `style:` formatting-only changes
- `refactor:` code changes with no functional difference
- `test:` adding or updating tests

## Release

Before tagging a release, follow `exampleSite/content/posts/release-checklist.md`.

```sh
pnpm lint && pnpm format:check && pnpm build && pnpm test
git tag v0.2.0
git push origin v0.2.0
```

Tags are the source of truth for released theme versions. Create GitHub Releases manually if they become useful later.
