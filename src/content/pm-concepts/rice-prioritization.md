---
title: "RICE Prioritization Framework"
desc: "A scoring model for weighing product bets by Reach, Impact, Confidence, and Effort."
metaTitle: "RICE Prioritization Framework: Formula & How to Use It"
date: 2026-09-19
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Prioritization
  - Frameworks
---

## What it is

RICE scores each initiative on four factors, then combines them into a single comparable number:

**RICE Score = (Reach × Impact × Confidence) ÷ Effort**

- **Reach** — how many users or customers the initiative affects in a given time period (e.g., "1,200 users/month").
- **Impact** — how much it moves the needle for each person it reaches, usually scored on a simple scale (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal).
- **Confidence** — how sure you are about your Reach and Impact estimates, expressed as a percentage (100% = high confidence, 80% = medium, 50% = low).
- **Effort** — the total person-time required, usually in person-months.

Higher scores rise to the top of the backlog; the formula forces every idea through the same lens instead of whichever one was pitched most persuasively.

## When to use it

RICE works best when you're comparing a long, varied backlog — feature requests, tech debt, experiments — and need a defensible, repeatable way to rank them for a roadmap review or stakeholder conversation. It's most useful when reach and effort can be estimated with real data (analytics, usage logs, engineering estimates) rather than guesswork.

## Common pitfalls

- **Inflated confidence scores.** Teams default to 100% confidence because it's the path of least resistance, which quietly erases the factor meant to discount weak evidence.
- **Effort estimates that ignore dependencies.** A "0.5 person-month" estimate that skips QA, design, and cross-team coordination will make the RICE score look better than the initiative actually is.
- **Reach numbers with no data behind them.** RICE is only as good as its inputs — a guessed reach figure produces a precise-looking score that isn't actually precise.
- **Using RICE as the only input.** RICE is a prioritization aid, not a replacement for strategic judgment about what the roadmap should be doing in the first place.
