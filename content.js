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

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_TOAST") {
    showToast(msg.url);
  }
});

function showToast(url) {
  document.getElementById("__clean_copy_toast__")?.remove();

  const toast = document.createElement("div");
  toast.id = "__clean_copy_toast__";

  const display = url.length > 60 ? url.slice(0, 57) + "…" : url;

  toast.innerHTML = `
    <span style="font-size:15px;line-height:1">🔗</span>
    <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(display)}</span>
    <span style="color:#86efac;font-weight:600;font-size:11px;flex-shrink:0">Copied!</span>
  `;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%) translateY(12px)",
    background: "#0f172a",
    color: "#f1f5f9",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontFamily: "-apple-system, 'SF Pro Text', system-ui, monospace",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "480px",
    width: "max-content",
    opacity: "0",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    pointerEvents: "none",
    letterSpacing: "0.01em",
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(8px)";
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
