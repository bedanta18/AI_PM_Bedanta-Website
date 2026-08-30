---
title: "Tokenization"
desc: "The process of breaking input text into smaller units, called tokens, before a language model processes it."
date: 2026-08-03
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Fundamentals
---

## Definition

**Tokenization** is the process of breaking input text into smaller units called **tokens** before it is processed by a language model.

A token may represent a complete word, part of a word, punctuation, or whitespace and other text elements. For example, a sentence may be divided into several tokens rather than simply splitting it at spaces.

Tokenization matters because language models operate on tokens rather than raw human-readable sentences. The tokenized input becomes the basis for subsequent processing.

## Why It Matters

Tokenization helps you reason about input size and model processing — it's why context windows, pricing, and latency are usually measured in tokens rather than words or characters.
