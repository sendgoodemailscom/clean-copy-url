// Clean Copy URL — page-level key interceptor.
//
// Chrome fires the extension's Cmd/Ctrl+Shift+K command on its own; this listener
// only stops aggressive pages (Google Docs, etc.) from swallowing the shortcut
// first. We block it solely when there's no text selected, so we never hijack the
// user's own copy action. The confirmation toast is injected from background.js.
window.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const modifier = isMac ? e.metaKey : e.ctrlKey;
  if (modifier && e.shiftKey && e.key.toLowerCase() === "k" && !e.altKey) {
    const selection = window.getSelection()?.toString();
    if (!selection) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }
}, true);
