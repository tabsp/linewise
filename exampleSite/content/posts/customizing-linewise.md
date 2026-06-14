---
title: "Customizing Linewise"
description: "Configuration keys and safe override points for the Hugo theme."
date: 2026-06-06
tags: ["reference", "hugo"]
---

Linewise is designed to keep routine customization in Hugo config and site-owned assets. Override templates only when configuration is not enough.

## Public config

Theme-owned options live under `[params.linewise]`.

```toml
[params.linewise]
description = "A personal blog."
author = "Your Name"
locale = "en"
favicon = "favicon.svg"
ogImage = "og.svg"
showExplorer = true
showBufferline = true
```

| Key              | Default                   | Purpose                                                     |
| ---------------- | ------------------------- | ----------------------------------------------------------- |
| `description`    | site description fallback | SEO and Open Graph fallback text                            |
| `author`         | empty                     | Author metadata where templates need it                     |
| `locale`         | site locale               | Theme-owned locale fallback for widgets                     |
| `favicon`        | `"favicon.svg"`           | Favicon path under your site's `static/` directory          |
| `ogImage`        | `"og.svg"`                | Open Graph image path under your site's `static/` directory |
| `showExplorer`   | `true`                    | Render the file explorer and mobile drawer                  |
| `showBufferline` | `true`                    | Render the bufferline above the workspace                   |

To ship a quieter layout, turn off either chrome region:

```toml
[params.linewise]
showExplorer = false
showBufferline = false
```

## Comments

Comments are configured under `[params.linewise.comments]`.

```toml
[params.linewise.comments]
provider = "none"
```

Set `provider = "giscus"` and add `[params.linewise.comments.giscus]` when you want GitHub Discussions comments.

## Safe override points

These partials are intended as public override points:

```text
layouts/_partials/head.html
layouts/_partials/comments.html
layouts/_partials/post-meta.html
layouts/shortcodes/aside.html
```

Copy the file into the same path in your site to override it.

## Internal partials

The command bar, explorer, bufferline, status line, page list, and script partials are tied to Linewise's TypeScript runtime. Treat these as internal unless you are comfortable maintaining a fork-like customization.

```text
layouts/_partials/command.html
layouts/_partials/explorer.html
layouts/_partials/help-panel.html
layouts/_partials/icon.html
layouts/_partials/topbar.html
layouts/_partials/status.html
layouts/_partials/page-list.html
layouts/_partials/scripts.html
```

If you override an internal partial, preserve the documented `data-lw-*` attributes or the keyboard and search runtime may stop working.
