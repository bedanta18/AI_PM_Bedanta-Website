---
title: "Knowledge Distillation"
desc: "Transferring useful behavior from a larger 'teacher' model into a smaller, cheaper 'student' model."
date: 2026-08-14
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Deployment & Efficiency
  - Training
---

## Definition

**Knowledge distillation** is a technique for transferring useful behavior from a larger model to a smaller model.

A common setup involves a large model acting as the **teacher** and a smaller model acting as the **student**. The student attempts to reproduce the teacher's outputs. When the student performs poorly, its internal weights are updated.

The objective is to create a smaller model that retains useful capabilities while requiring fewer computational resources. This can make the resulting model faster and easier to host in production.

## Why It Matters

Fine-tuning and distillation help you evaluate model specialization strategies — when it's worth training a smaller, cheaper model instead of calling a large one for every request.
