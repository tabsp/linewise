import { mkdtemp, mkdir, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = new URL("..", import.meta.url).pathname;

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(
      [`${command} ${args.join(" ")} failed in ${cwd}`, result.stdout.trim(), result.stderr.trim()]
        .filter(Boolean)
        .join("\n\n")
    );
  }
}

async function writeStaticAssets(siteDir) {
  const staticDir = join(siteDir, "static");
  await mkdir(staticDir, { recursive: true });
  await writeFile(
    join(staticDir, "favicon.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1"/></svg>\n'
  );
  await writeFile(
    join(staticDir, "og.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630"/></svg>\n'
  );
}

async function writeSmokePost(siteDir, title) {
  const postsDir = join(siteDir, "content", "posts");
  await mkdir(postsDir, { recursive: true });
  await writeFile(
    join(postsDir, "smoke-post.md"),
    `---
title: "${title}"
description: "Linewise installation smoke test."
date: 2026-06-14
tags: ["smoke"]
---

\`\`\`ts
const ok: boolean = true;
\`\`\`
`
  );
}

function baseConfig(title) {
  return `baseURL = "https://example.com"
title = "${title}"
locale = "en"

[taxonomies]
tag = "tags"

[params.linewise]
description = "Smoke test"
author = "Linewise"
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
`;
}

async function smokeSubmoduleInstall() {
  const siteDir = await mkdtemp(join(tmpdir(), "linewise-submodule-smoke-"));
  await mkdir(join(siteDir, "themes"), { recursive: true });
  await symlink(repoRoot, join(siteDir, "themes", "linewise"));
  await writeStaticAssets(siteDir);
  await writeSmokePost(siteDir, "Submodule Smoke Post");
  await writeFile(
    join(siteDir, "hugo.toml"),
    `${baseConfig("Submodule Smoke")}theme = "linewise"\n`
  );

  run("hugo", ["--source", siteDir], siteDir);
  console.log(`submodule install smoke passed: ${siteDir}`);
}

async function smokeModuleInstall() {
  const siteDir = await mkdtemp(join(tmpdir(), "linewise-module-smoke-"));
  await writeStaticAssets(siteDir);
  await writeSmokePost(siteDir, "Module Smoke Post");
  await writeFile(
    join(siteDir, "go.mod"),
    `module example.com/linewise-module-smoke

go 1.23

require github.com/tabsp/linewise v0.0.0

replace github.com/tabsp/linewise => ${repoRoot}
`
  );
  await writeFile(
    join(siteDir, "hugo.toml"),
    `${baseConfig("Module Smoke")}
[module]
[[module.imports]]
path = "github.com/tabsp/linewise"
`
  );

  run("hugo", ["--source", siteDir], siteDir);
  console.log(`module install smoke passed: ${siteDir}`);
}

await smokeSubmoduleInstall();
await smokeModuleInstall();
