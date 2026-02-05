# Story Magic — Test Site

Rebranded prototype with all new features. Static demo — no backend required.

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Story Magic v2 rebrand"
git branch -M main
git remote add origin https://github.com/YOUR_USER/storymagic-test.git
git push -u origin main

# 2. Go to vercel.com/new → Import repo → Deploy
```

## Local Dev

```bash
npm install && npm run dev
```

## Pages

| Route | Feature |
|-------|---------|
| `/` | Home — story library, create, mode select, playback |
| `/classics` | 15 Min Classics — collection → episodes → playback |
| `/reading` | Parent Reading Mode — tap-to-advance, prompts, dim modes |
| `/settings` | Settings stub |

## Brand Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#1a1a2e` | Background |
| Charcoal | `#2d2d44` | Cards |
| Lavender | `#b8a9d9` | Primary accent |
| Cream | `#e8d5b7` | Secondary accent |
| Gold | `#d4a574` | Premium / custom voices |

---
© Story Magic Pty Ltd
