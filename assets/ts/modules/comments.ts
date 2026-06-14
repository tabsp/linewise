const giscusClientUrl = "https://giscus.app/client.js";

export function initializeInsertedComments() {
  document
    .querySelectorAll<HTMLScriptElement>(`.giscus-comments script[src="${giscusClientUrl}"]`)
    .forEach(script => {
      if (script.dataset.linewiseExecuted === "true") return;

      const replacement = document.createElement("script");
      for (const attribute of script.attributes) {
        replacement.setAttribute(attribute.name, attribute.value);
      }
      replacement.dataset.linewiseExecuted = "true";

      const mount = script.parentElement?.querySelector(".giscus");
      mount?.replaceChildren();
      script.replaceWith(replacement);
    });
}
