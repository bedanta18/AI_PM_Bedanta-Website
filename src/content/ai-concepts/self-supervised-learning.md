---
title: "Self-Supervised Learning"
desc: "A training approach where the structure of existing data provides the learning signal, without manual labeling."
date: 2026-08-10
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Fundamentals
  - Training
---

## Definition

**Self-supervised learning** is a training approach in which the structure of the existing data provides the learning signal.

Instead of requiring humans to manually label every example, the model creates prediction tasks from the data itself. For language models, a sequence can be used to create multiple next-token prediction tasks. The model makes predictions, compares them with the expected tokens already present in the data, and updates its internal weights when it makes mistakes.

This approach is highly scalable because large quantities of existing text can be used for training without requiring a human to label every individual example.

Self-supervised learning is also applicable beyond text, including images and video.
