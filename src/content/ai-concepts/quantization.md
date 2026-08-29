---
title: "Quantization"
desc: "Reducing the numerical precision of a trained model's weights to cut memory and compute needs at inference time."
date: 2026-08-30
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Deployment & Efficiency
---

## Definition

**Quantization** reduces the numerical precision used to represent model weights.

For example, a weight represented using a 32-bit number can potentially be represented using a lower-bit format. The objective is to reduce the memory and computational requirements of running a trained model.

An important point is that quantization is primarily associated with **inference and deployment efficiency**. It does not necessarily reduce the original cost of training the fully trained model, because quantization is typically applied after training.

## Why It Matters

Quantization and SLMs help you reason about latency, hosting, and inference cost — the levers that decide whether an AI feature is actually affordable to run.
