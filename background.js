const JUNK_PARAMS = new Set([
  // Google Ads
  "gclid", "gclsrc", "gbraid", "wbraid", "dclid",
  // Microsoft / Bing
  "msclkid",
  // Facebook / Meta
  "fbclid",
  // Instagram
  "igshid", "igsh",
  // Twitter / X
  "twclid",
  // TikTok
  "ttclid",
  // Yandex / Openstat
  "yclid", "_openstat",
  // Mailchimp / Mandrill
  "mc_cid", "mc_eid", "oly_anon_id", "oly_enc_id",
  // HubSpot
  "_hsenc", "_hsmi", "hsCtaTracking",
  // Marketo
  "mkt_tok",
  // Amazon
  "_encoding", "pd_rd_w", "pd_rd_wg", "pd_rd_r", "pd_rd_i",
  "pf_rd_p", "pf_rd_r", "pf_rd_m", "pf_rd_s", "pf_rd_t", "pf_rd_i",
  "content-id", "ref_", "ref",
  // LinkedIn
  "trackingId", "lipi", "licu",
  // Spotify
  "si",
  // YouTube
  "feature",
  // Zanox
  "zanpid",
  // LinkedIn search session state
  "origin", "sortBy",
  // UTM params (utm_source, utm_medium, utm_campaign, utm_term, utm_content, …)
  // are matched by the "utm_" prefix in cleanUrl() below.
]);

function cleanUrl(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return rawUrl; }

  const toDelete = [];
  for (const key of url.searchParams.keys()) {
    const lower = key.toLowerCase();
    if (
      JUNK_PARAMS.has(key) || JUNK_PARAMS.has(lower) ||
      lower.startsWith("utm_") || lower.startsWith("pd_rd_") || lower.startsWith("pf_rd_") ||
      lower.startsWith("_hs") || lower.startsWith("mc_")
    ) {
      toDelete.push(key);
    }
  }
  toDelete.forEach(k => url.searchParams.delete(k));
  return url.toString();
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "copy-clean-url") return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const cleanedUrl = cleanUrl(tab.url);

  await copyToClipboard(cleanedUrl, tab.id);

  showToast(cleanedUrl, tab.id);

  // Badge feedback as fallback (e.g. on chrome:// pages where content script can't run)
  chrome.action.setBadgeText({ text: "✓", tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: "#22c55e", tabId: tab.id });
  setTimeout(() => chrome.action.setBadgeText({ text: "", tabId: tab.id }), 1500);
});

async function copyToClipboard(text, tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: (t) => navigator.clipboard.writeText(t),
    args: [text],
  });
}

// Inject the confirmation toast directly, so it appears on any tab — even ones
// opened before the extension loaded (a plain message to the content script
// silently fails there, which is why the toast could go missing). Shown in the
// top-right with a 20px margin, roughly under the extension icon in the toolbar.
async function showToast(url, tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      args: [url],
      func: (cleanUrl) => {
        const ID = "__clean_copy_toast__";
        document.getElementById(ID)?.remove();
        const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const display = cleanUrl.length > 60 ? cleanUrl.slice(0, 57) + "…" : cleanUrl;
        const toast = document.createElement("div");
        toast.id = ID;
        toast.innerHTML =
          '<span style="font-size:15px;line-height:1">🔗</span>' +
          '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(display) + '</span>' +
          '<span style="color:#86efac;font-weight:600;font-size:11px;flex-shrink:0">Copied!</span>';
        Object.assign(toast.style, {
          position: "fixed",
          top: "20px",
          right: "20px",
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
          transform: "translateY(-8px)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
          pointerEvents: "none",
          letterSpacing: "0.01em",
        });
        (document.body || document.documentElement).appendChild(toast);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          toast.style.opacity = "1";
          toast.style.transform = "translateY(0)";
        }));
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-8px)";
          setTimeout(() => toast.remove(), 200);
        }, 2000);
      },
    });
  } catch (e) {
    // Injection blocked (chrome:// pages, the Web Store, etc.) — the badge tick covers those.
  }
}
