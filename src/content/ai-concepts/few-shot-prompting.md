---
title: "Few-Shot Prompting"
desc: "Providing examples inside a prompt so a model understands the expected task or response format — no retraining required."
date: 2026-08-11
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Retrieval & Context
---

## Definition

**Few-shot prompting** means providing examples in the prompt so that a model can understand the expected task or response format.

Instead of simply sending "Where is my parcel?", a system can provide examples showing how similar customer questions should be answered. These examples give the model additional context at inference time.

The important distinction is that few-shot prompting does not require retraining the model. The examples are supplied as part of the request itself.
