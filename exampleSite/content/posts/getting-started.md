---
title: "Getting Started with Linewise"
description: "How to install, configure, and write your first post."
date: 2026-06-09
tags: ["meta", "hugo"]
---

Linewise is a Hugo theme. Your site owns the content, config, and branding; the theme owns the layouts, styles, and interaction model.

## Installation

Create a Hugo site:

```sh
hugo new site my-blog
cd my-blog
```

Then choose one installation mode.

### Git submodule

Add Linewise under `themes/linewise`:

```sh
git submodule add https://github.com/tabsp/linewise themes/linewise
```

Configure Hugo with `theme = "linewise"`:

```toml
baseURL = "https://example.com"
title = "My Blog"
locale = "en"
theme = "linewise"
```

### Hugo Module

Initialize module support in your site:

```sh
hugo mod init github.com/you/my-blog
```

Import Linewise in `hugo.toml`:

```toml
baseURL = "https://example.com"
title = "My Blog"
locale = "en"

[module]
[[module.imports]]
path = "github.com/tabsp/linewise"
```

Do not configure both `theme = "linewise"` and the module import in the same site.

## Configuration

Whichever installation mode you choose, add Linewise's required site settings:

```toml
[taxonomies]
tag = "tags"

[params.linewise]
description = "A personal blog."
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

See [Customizing Linewise](/posts/customizing-linewise/) for the complete public configuration surface and safe override points.

Start the development server:

```sh
hugo server
```

## Writing posts

Add Markdown files to `content/posts/`. Each post should include frontmatter:

```md
---
title: "Your Post Title"
description: "A short description for SEO and previews."
date: 2026-01-01
lastmod: 2026-01-02
tags: ["tag-one", "tag-two"]
draft: false
---

Your content goes here.
```

- `date` controls the post date and sort order.
- `lastmod` is optional.
- `tags` are used for taxonomy pages and search.
- `draft` hides the post from normal builds when set to `true`.

## Project layout

```text
hugo.toml              Site configuration
content/posts/         Markdown posts
static/                Site-owned static assets
themes/linewise/       Theme code
```

Replace the example content, update your site metadata, and run `hugo` to publish a static site.
