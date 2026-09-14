// Must mirror background.js
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
  try { url = new URL(rawUrl); } catch { return { clean: rawUrl, stripped: [] }; }

  const stripped = [];
  const toDelete = [];

  for (const key of url.searchParams.keys()) {
    const lower = key.toLowerCase();
    if (
      JUNK_PARAMS.has(key) || JUNK_PARAMS.has(lower) ||
      lower.startsWith("utm_") || lower.startsWith("pd_rd_") || lower.startsWith("pf_rd_") ||
      lower.startsWith("_hs") || lower.startsWith("mc_")
    ) {
      toDelete.push(key);
      stripped.push(key);
    }
  }

  toDelete.forEach(k => url.searchParams.delete(k));
  return { clean: url.toString(), stripped };
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const { clean, stripped } = cleanUrl(tab.url);

  document.getElementById("cleanUrl").textContent = clean;

  if (stripped.length) {
    document.getElementById("strippedSection").style.display = "block";
    document.getElementById("strippedList").innerHTML =
      stripped.map(p => `<span>— ${p}</span>`).join("");
  }

  document.getElementById("copyBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(clean);
    const btn = document.getElementById("copyBtn");
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy clean URL";
      btn.classList.remove("copied");
    }, 1500);
  });
})();
