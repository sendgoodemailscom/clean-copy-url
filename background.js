const JUNK_PARAMS = new Set([
  // Amazon
  "_encoding", "pd_rd_w", "pd_rd_wg", "pd_rd_r", "pd_rd_i",
  "pf_rd_p", "pf_rd_r", "pf_rd_m", "pf_rd_s", "pf_rd_t", "pf_rd_i",
  "content-id", "ref_", "ref",
  // LinkedIn
  "trackingId", "lipi", "licu",
  // Instagram
  "igshid", "igsh",
  // Spotify
  "si",
  // Mailchimp
  "mc_cid", "mc_eid",
  "oly_anon_id", "oly_enc_id",
  // HubSpot
  "_hsenc", "_hsmi", "hsCtaTracking",
  // Marketo
  "mkt_tok",
  // Twitter/X
  "twclid",
  // Facebook
  "fbclid",
  // Microsoft
  "msclkid",
  // Google
  "gclsrc", "dclid",
  // Zanox
  "zanpid",
  // LinkedIn search session state
  "origin", "sortBy",
]);

function cleanUrl(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return rawUrl; }

  const toDelete = [];
  for (const key of url.searchParams.keys()) {
    const lower = key.toLowerCase();
    if (
      JUNK_PARAMS.has(key) || JUNK_PARAMS.has(lower) ||
      lower.startsWith("pd_rd_") || lower.startsWith("pf_rd_") ||
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

  chrome.tabs.sendMessage(tab.id, { type: "SHOW_TOAST", url: cleanedUrl });

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
