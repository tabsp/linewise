---
title: "Theme Reference"
description: "Install, configure, customize, and operate the Linewise Hugo theme."
date: 2026-06-07
tags: ["reference", "hugo"]
---

This reference is the canonical user-facing documentation for Linewise.

## Requirements

- Hugo Extended `0.146.0` or newer
- Git, when installing with a submodule
- Go, when installing with Hugo Modules

## Installation

Choose one installation mode per site. Do not configure both a git submodule and a Hugo Module import in the same site.

### Git submodule

```sh
hugo new site my-blog
cd my-blog
git submodule add https://github.com/tabsp/linewise themes/linewise
```

```toml
baseURL = "https://example.com"
title = "My Blog"
locale = "en"
theme = "linewise"
```

### Hugo Module

```sh
hugo mod init github.com/you/my-blog
```

```toml
baseURL = "https://example.com"
title = "My Blog"
locale = "en"

[module]
[[module.imports]]
path = "github.com/tabsp/linewise"
```

## Required site config

```toml
[taxonomies]
tag = "tags"

[params.linewise]
description = "Notes from the command line."
author = "Your Name"
locale = "en"
favicon = "favicon.svg"
ogImage = "og.svg"
showExplorer = true
showBufferline = true

[params.linewise.comments]
provider = "none"

[outputs]
home = ["HTML", "RSS", "JSON"]

[outputFormats.JSON]
mediaType = "application/json"
baseName = "search"
isPlainText = true

[markup.highlight]
noClasses = false
```

Linewise ships CSS for Hugo's class-based Chroma output. Keep `noClasses = false` so code blocks use the theme palette.

## Content

Put posts in `content/posts/`.

```md
---
title: "Your Post Title"
description: "A short description for SEO and previews."
date: 2026-01-01
lastmod: 2026-01-02
tags: ["reference"]
draft: false
---
```

## Public config

Theme-owned options live under `[params.linewise]`.

| Key                 | Default                   | Purpose                                                         |
| ------------------- | ------------------------- | --------------------------------------------------------------- |
| `description`       | site description fallback | SEO and Open Graph fallback text                                |
| `author`            | empty                     | Author metadata where templates need it                         |
| `locale`            | site locale               | Theme-owned locale fallback for widgets                         |
| `favicon`           | `"favicon.svg"`           | Favicon path under your site's `static/` directory              |
| `ogImage`           | `"og.svg"`                | Open Graph image path under your site's `static/` directory     |
| `showExplorer`      | `true`                    | Render the file explorer and mobile drawer                      |
| `showBufferline`    | `true`                    | Render the bufferline above the workspace                       |
| `comments.provider` | `"none"`                  | Comments provider. Supported values are `"none"` and `"giscus"` |

## Search

Linewise generates `/search.json` with Hugo's home JSON output. The browser runtime lazy-loads that file on the first search interaction and reuses it for the search palette and `/find/` page.

## Override boundaries

These files are public override points:

```text
layouts/_partials/head.html
layouts/_partials/comments.html
layouts/_partials/post-meta.html
layouts/shortcodes/aside.html
```

Copy one into the same path in your site to override it.

These partials are internal for now because the TypeScript runtime depends on their `data-lw-*` hooks:

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

If you override an internal partial, preserve the `data-lw-*` attributes or the keyboard and search runtime may stop working.

## Upgrade workflow

For a git submodule install:

```sh
cd themes/linewise
git fetch --tags
git checkout v0.2.0
cd ../..
hugo
```

Then commit the submodule pointer in your site.

For a Hugo Module install:

```sh
hugo mod get github.com/tabsp/linewise@v0.2.0
hugo mod tidy
hugo
```

Review local layout overrides, custom CSS, and release notes after each theme update.
