# 🌐 Language Switch — How It Works & Current Status

## Architecture Overview

The project has a **fully built** bilingual system (বাংলা / English) with:

| File | Role |
|---|---|
| `src/context/LanguageContext.tsx` | Stores current language state, persists to `localStorage` |
| `src/locales/bn.ts` | All Bengali translations |
| `src/locales/en.ts` | All English translations |
| `src/components/shared/LanguageSwitch.tsx` | The toggle button (বাং / ENG) in the header |
| `src/app/layout.tsx` | Wraps entire app with `<LanguageProvider>` ✅ |

---

## ⚠️ Why Language Switch Appears Broken

**The switch works — but most components ignore it.**

The `LanguageContext` correctly updates state and saves to `localStorage` when toggled.
However, the majority of components have their text **hardcoded in Bengali** instead of reading from the translation context.

### Example of the problem:

```tsx
// ❌ WRONG — hardcoded, language switch has no effect
<h2>আমাদের প্রধান সেবাসমূহ</h2>

// ✅ CORRECT — reads from translation context
const { t } = useLanguage();
<h2>{t.home.services.title}</h2>
```

### Components currently hardcoded (not using `useLanguage`):
- `Header.tsx` — nav links, button labels
- `HeroBanner.tsx` — slide titles, subtitles, CTA buttons
- `MainServices.tsx` — service titles, descriptions, button text
- `HomeMiddleSection.tsx` — all section text
- `HomeBottomSection.tsx`
- `Footer.tsx`
- All page components under `src/app/`

---

## ✅ How to Properly Wire a Component

### Step 1 — Import and call the hook
```tsx
import { useLanguage } from "@/context/LanguageContext";

export default function MyComponent() {
  const { t } = useLanguage();
  // ...
}
```

### Step 2 — Replace hardcoded text with translation keys
```tsx
// Before
<h2>আমাদের প্রধান সেবাসমূহ</h2>
<p>আপনার প্রয়োজন অনুযায়ী পেশাদার সেবা</p>

// After
<h2>{t.home.services.title}</h2>
<p>{t.home.services.subtitle}</p>
```

### Step 3 — For bilingual data (titleBn / titleEn from API/DB)
```tsx
const { language } = useLanguage();

// Pick the right field based on current language
const title = language === "bn" ? item.titleBn : item.titleEn;
const desc  = language === "bn" ? item.descBn  : item.descEn;
```

---

## Translation File Structure

Both `bn.ts` and `en.ts` follow the **exact same key structure**:

```
t.common.*        → shared labels (Book Service, Call Now, etc.)
t.nav.*           → navigation links
t.header.*        → header bar text
t.footer.*        → footer text
t.home.*          → homepage sections
t.home.hero.*     → hero banner slides
t.home.services.* → main services section
t.home.whyChoose.*→ why choose us section
t.home.howItWorks.*
t.home.testimonials.*
t.home.noticeBoard.*
t.about.*
t.services.*
t.training.*
t.bookService.*
t.jobApplication.*
t.noticeBoard.*
t.gallery.*
t.reviews.*
t.contact.*
```

---

## Banner Type Badges (Added)

The `HeroBanner` now supports a `type` field on each banner from the DB:

| type | Badge Label | Color |
|---|---|---|
| `offer` | Running Offer | 🔴 Red |
| `campaign` | Promotional Campaign | 🟠 Orange |
| `training` | Training Announcement | 🔵 Blue |
| `service` | Care Service Promotion | 🟢 Green |

Fallback static slides have no `type` set — badge will not show. This is intentional.

---

## Rules for Future Development

1. **Never hardcode display text** in a component. Always use `t.*` from `useLanguage()`.
2. **For DB content** (banners, services, notices etc.) that has `titleBn`/`titleEn` fields — always use `language === "bn" ? item.titleBn : item.titleEn` pattern.
3. **When adding new translation keys** — add to BOTH `bn.ts` and `en.ts` at the same path.
4. **`LanguageProvider` is already in `layout.tsx`** — do not add it again anywhere.
5. **`localStorage` key** is `"nexivio-lang"` — do not change this key name.
6. **Default language** is `"bn"` (Bengali). English is opt-in.

---

## Quick Checklist Before Committing a New Component

- [ ] Does it display any user-facing text?
- [ ] Is `useLanguage()` imported and called?
- [ ] Are all static strings replaced with `t.*` keys?
- [ ] For bilingual DB fields — is `language` used to pick `Bn` vs `En`?
- [ ] Are the translation keys added to both `bn.ts` and `en.ts`?
