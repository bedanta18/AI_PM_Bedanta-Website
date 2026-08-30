---
title: "Context Summarization"
desc: "Compressing older conversation history into a shorter representation to control context size and inference cost."
date: 2026-08-24
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Retrieval & Context
---

## Definition

As conversations become longer, sending the entire conversation history to a model can become inefficient.

**Context summarization** reduces this problem by compressing older information into a shorter representation. For example, an application could:

- Keep the most recent messages directly available.
- Summarize older conversations.
- Preserve important preferences or facts.
- Send the resulting context to the larger model.

This can help control context size and inference costs while retaining useful information from previous interactions.
