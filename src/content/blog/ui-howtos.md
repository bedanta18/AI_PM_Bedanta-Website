---
title: "Falana Anna"
desc: "A short hello from Bedanta Gogoi's new product and growth writing space."
date: 2026-06-20
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Product Management
  - Growth
section:
  - Marketing and Growth
---

## The Before State

The original schema had three separate author join tables:

| Table | Domain FK | Notes |
|---|---|---|
| `BlogAuthors` | `BlogId` | No `Role` field |
| `GalleryAuthors` | `AlbumId` | No `Role` field |
| `TrackAuthors` | `TrackId` | Had `Role` (e.g. "producer", "vocalist") |

