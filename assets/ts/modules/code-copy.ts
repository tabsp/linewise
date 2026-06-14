const copySuccessMs = 1400;

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function codeText(block: HTMLElement) {
  const code = block.querySelector<HTMLElement>("code");
  return code?.innerText.trimEnd() ?? "";
}

export function initializeCodeCopy() {
  document.querySelectorAll<HTMLElement>(".prose .highlight").forEach(block => {
    if (block.dataset.copyReady === "true") return;

    const text = codeText(block);
    if (!text) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.dataset.codeCopy = "";
    button.textContent = "copy";
    button.setAttribute("aria-label", "Copy code");

    let resetTimer: number | undefined;
    button.addEventListener("click", async () => {
      window.clearTimeout(resetTimer);
      button.disabled = true;

      try {
        await writeClipboard(codeText(block));
        button.textContent = "copied";
        button.dataset.state = "copied";
        button.setAttribute("aria-label", "Code copied");
      } catch {
        button.textContent = "failed";
        button.dataset.state = "failed";
        button.setAttribute("aria-label", "Copy failed");
      } finally {
        button.disabled = false;
        resetTimer = window.setTimeout(() => {
          button.textContent = "copy";
          button.dataset.state = "";
          button.setAttribute("aria-label", "Copy code");
        }, copySuccessMs);
      }
    });

    block.append(button);
    block.dataset.copyReady = "true";
  });
}
