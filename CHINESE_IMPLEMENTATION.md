# Simplified Chinese website addition

## Scope

New pages: `zh.html`, `zh-about.html`, `zh-menu.html`, `private-spa-gangnam-zh.html`, `zh-privacy.html`.

Existing KR/EN/JA pages keep their content, inline styles, canonical URLs, structured data and scripts. Their only HTML changes are the Chinese alternate URL, language link, and a scoped header stylesheet/class. Existing photos, logo, portrait source/ratio, program names, prices and durations are reused.

Chinese uses Mainland simplified characters and concrete spa terminology (身体按摩、面部护理、双人护理、预约). Reference: https://www.fourseasons.com/zh/beijing/spa/ . The official English brand/program names and existing slogan stay intact. Lee Jumi's name remains in its provided romanization; no unverified Chinese name is invented. The Korean publisher name and original interview URL are retained, with a Chinese translation notice.

Service facts are checked against the current Korean program page, including 60-minute back-focused care, two-person total prices, and the add-on-only bath. Prices are in Korean won, never yuan. Chinese links to phone numbers use the international dialing format for the same existing numbers.

## Generation and verification

Run from the repository root:

```sh
node scripts/build-chinese-pages.mjs
node scripts/verify-language-pages.mjs
node scripts/verify-chinese-content.mjs
```

`build-chinese-pages.mjs` takes the current checked-in English layouts (not the old language renderer), uses reviewed translations in `scripts/i18n/zh-CN.json`, and fails when an unmapped source string is encountered. It removes old runtime language substitution from Chinese output. Normal menu/reveal/tab/video interactions live in `chinese-page.js`; Chinese text is available without JavaScript.

Do not run `build-language-pages.mjs` or `build-private-spa-pages.mjs` as part of this Chinese build: those older generators are not the source of truth for the current refined pages and contain older program/layout data. A future change to those generators must reconcile all current content before regeneration.

For browser verification, serve the repository locally and run with Playwright available in Node's module search path:

```sh
python3 -m http.server 8765
# In another terminal:
node scripts/verify-chinese-browser.cjs
```

Optional environment variables: `AIRE_TEST_URL` (default localhost:8765) and `AIRE_TEST_OUTPUT` (default /tmp/aire-chinese-qa).

The browser check covers Chinese layouts at 320, 360, 390, 430, 768, 1024 and 1440 CSS pixels; image ratio; price/time parity with the current Korean renderer; mobile menus; language round trips; program tabs; booking navigation; FAQ; and privacy links. It does not submit bookings.

## Booking boundary

The separate booking application currently supports KO/EN/JP. A real browser check of `book?lang=zh` returned Korean, not Chinese. Therefore the Chinese site links to the supported English booking form and explicitly labels the available languages. NAVER is labeled as a Korean page. No booking-service code or records were changed.

## Remaining limits

Browser viewport and WebKit touch emulation are not a physical-phone or Mainland-network test. Mainland accessibility of external maps/social sites is not confirmed. A native Mainland Chinese human proofread has not been performed. This change does not claim Chinese-language booking support.

## Validation completed on 2026-10-06

- Chromium: 35 Chinese page/viewport combinations, 36 existing-language-to-Chinese navigation cases, and Chinese-to-KR/EN/JA round trips passed.
- Compared all displayed course prices, durations and two-person counts with the current Korean program renderer.
- WebKit: 12 mobile page cases at 320/390/430 widths; six final copy/layout cases at 320/390 also passed. Mobile menu open/close tested with touch emulation.
- Resolved a 320/360-width CTA overflow and the legacy language-storage collision on returning to Korean.
- Verified existing 12 page files are byte-identical to their prior versions after removing only the fourth-language link, alternate URL and scoped header additions.
- Static content, local asset/link, schema, hreflang, sitemap, deterministic rebuild and whitespace checks passed.
