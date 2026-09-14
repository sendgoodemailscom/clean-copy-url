# 🔗 Clean Copy URL

**Copy the current tab's URL with all the tracking junk stripped out — one keyboard shortcut, no cruft.**

![Manifest V3](https://img.shields.io/badge/Manifest-V3-15121f)
![Version](https://img.shields.io/badge/version-1.4-FF3FA4)
[![Made by David Bustos](https://img.shields.io/badge/made%20by-David%20Bustos-00B8D4)](https://david.sendgoodemails.com)

You know when you copy a link to share it and it comes with `?utm_source=newsletter&utm_medium=email&fbclid=IwAR...` bolted onto the end? **Clean Copy URL** strips all of that the moment you copy, so you share clean, readable links instead of tracking spaghetti.

Press **⌘⇧K** (or **Ctrl+Shift+K**) on any page → the cleaned URL is on your clipboard, with a small toast showing what got removed. That's the whole thing.

---

## ✨ Features

- **One shortcut** — ⌘⇧K / Ctrl+Shift+K copies the clean URL instantly, no clicking around
- **Strips 40+ tracking parameters** across every platform that bolts them on (full list below)
- **Popup preview** — click the toolbar icon to see the cleaned URL and exactly which params were removed
- **On-page toast** — a subtle confirmation so you know it worked (with a badge fallback on pages where scripts can't run)
- **100% local & private** — everything happens in your browser. No network requests, no analytics, no accounts
- **Manifest V3**, lightweight, zero dependencies

## ⌨️ How it works

1. Land on any page with a messy URL.
2. Hit **⌘⇧K** (macOS) / **Ctrl+Shift+K** (Windows / Linux).
3. The clean URL is copied — a toast confirms what was stripped.

Prefer to click? The toolbar popup shows the cleaned URL with a **Copy** button and a breakdown of the removed parameters.

> Want a different shortcut? Set it at `chrome://extensions/shortcuts`.

## 🧹 What gets stripped

| Source | Parameters |
| --- | --- |
| **UTM** | `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` — any `utm_*` |
| **Google Ads / Analytics** | `gclid`, `gbraid`, `wbraid`, `gclsrc`, `dclid` |
| **Facebook / Meta** | `fbclid` |
| **Microsoft / Bing** | `msclkid` |
| **Twitter / X** | `twclid` |
| **TikTok** | `ttclid` |
| **Instagram** | `igshid`, `igsh` |
| **Yandex / Openstat** | `yclid`, `_openstat` |
| **Email (Mailchimp, HubSpot, Marketo)** | `mc_cid`, `mc_eid`, `_hsenc`, `_hsmi`, `hsCtaTracking`, `mkt_tok`, `oly_anon_id`, `oly_enc_id` |
| **Amazon** | the `pd_rd_*` / `pf_rd_*` family, `_encoding`, `ref` / `ref_`, `content-id` |
| **LinkedIn** | `trackingId`, `lipi`, `licu` (+ `origin`, `sortBy` on search) |
| **Spotify** | `si` |
| **YouTube** | `feature` |

The query params your link actually needs — ids, page numbers, search queries — are left untouched.

## 📦 Install

Load it as an unpacked extension (about 30 seconds):

1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the extension folder.
5. Pin the icon — done. (Optional: confirm the shortcut at `chrome://extensions/shortcuts`.)

Works in Chrome and any Chromium browser (Edge, Brave, Arc, Vivaldi…).

## 🔒 Privacy

Clean Copy URL **never makes a network request.** It reads the active tab's URL, removes known tracking parameters locally, and writes the result to your clipboard. No data collection, no analytics, no accounts, no servers — the tracking-stripper that doesn't track you.

**Permissions, briefly:**

- `activeTab` / `tabs` — read the URL of the tab you're on
- `clipboardWrite` — put the cleaned URL on your clipboard
- `scripting` — inject the clipboard write and the confirmation toast
- `<all_urls>` — so the shortcut works on every site

## 👋 Built by David Bustos

I'm an email & content marketer who builds small tools to kill everyday friction. If clean links are your thing, you might like the rest of what I make:

- 🌐 **Portfolio & tools** — [david.sendgoodemails.com](https://david.sendgoodemails.com)
- 📨 **Subject Line Checker** — see exactly how your subject line truncates across Gmail, Apple Mail, Outlook & Yahoo before you hit send → [live tool](https://david.sendgoodemails.com/subject-line-checker/) · [repo](https://github.com/sendgoodemailscom/subject-line-checker)
- 🗂️ **Tab Switcher** — a visual Alt+Tab for your browser tabs → [repo](https://github.com/sendgoodemailscom/tab-switcher-extension)
- ✉️ **Send Good Emails** — my email-marketing site & newsletter → [sendgoodemails.com](https://www.sendgoodemails.com)

---

Spotted a tracking param it misses, or want one added? [Open an issue or PR](https://github.com/sendgoodemailscom/clean-copy-url/issues) — the list grows with what people report.
