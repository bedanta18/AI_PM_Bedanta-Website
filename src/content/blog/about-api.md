---
title: "About API: Understanding API for a Dummy Like Me"
desc: "A plain-language walkthrough of what an API actually is, using a waiter analogy, a flight-booking example, and the jargon every PM eventually has to learn."
metaTitle: "What Is an API? A Plain-English Guide for Product Managers"
metaDescription: "Understand what an API is, how a request and response actually works, and the key terms (endpoint, payload, status codes) every product manager should know."
keywords:
  - what is an api
  - api explained for beginners
  - api for product managers
  - api request and response
  - rest api basics
  - api status codes
date: 2022-05-05
ispublished: true
author: "Bedanta Gogoi"
categories:
  - Product Management
section:
  - Product Management
---
API stands for Application Programming Interface. Strip away the acronym and it's really just a messenger: when one system needs something from another, the API carries the request over, the second system does its thing, and the API brings the response back.

![API icon representing two connected systems](/blog-images/api-basics-icon.png)

## The Waiter Analogy 🍽️
Think of a restaurant. You don't walk into the kitchen and start cooking — you tell the waiter what you want, the waiter carries your order to the kitchen following the rules laid out in the menu, and comes back with your dish.

The waiter is the API. You're the system making the request. The kitchen is the server doing the work. The menu is the fixed set of things you're allowed to ask for — ask for something that isn't on it, and you won't get a plate back. That exchange, ask and receive, is the whole idea of "request" and "response" that APIs are built around.

![Waiter icon illustrating the API-as-intermediary analogy](/blog-images/api-waiter-analogy.png)

## Why Do We Even Need APIs?
Two systems don't automatically know how to talk to each other, and even if they did, most systems won't — and shouldn't — let just anyone poke around inside their internals. An API is the controlled doorway: it exposes exactly what needs to be shared and nothing more.

## A Real Example: Booking a Flight
Every time you search flights online, you're using an API without thinking about it. You enter a few parameters — departure city, destination, number of seats, travel date — hit search, and the API matches those parameters against the airline's inventory and hands back a list of flights that fit. You never see the airline's actual database; you just see the response.

## What's Inside an API Request
An API request is built from a handful of standard pieces:

- **Base URL** — the address of the API itself
- **Endpoint** — the specific door within that address you're knocking on
- **Parameters** — the details of what you're asking for
- **Output format** — almost always JSON these days
- **API key** — your credential, proving you're allowed to ask

![Two arrows representing the back-and-forth of an API request and response](/blog-images/api-request-exchange.png)

## Reading the Response: Status Codes
Once a request goes out, the response comes back with a status code that tells you what happened:

- **200** — success, here's your data
- **400** — bad request, something you sent didn't make sense
- **500** — server error, the problem's on their end
- **503** — server unavailable, try again later

## A Few Terms Worth Knowing
- **Payload** — the actual data you get back after a request
- **GET** — ask for data
- **POST** — send new data to the server
- **PUT** — update data that already exists
- **DELETE** — remove data

## What an API Is Not
It's easy to lump "API" in with "server" or "database," but they're different things. A server hosts and runs the application; a database stores the data. The API is neither of those — it's simply the interface connecting them. It's also not the same as an SDK, which is a full toolkit for building on a platform rather than just a channel for requests and responses.

Once the waiter analogy clicks, the rest of the jargon — endpoints, payloads, status codes — stops being intimidating. It's just the vocabulary for describing who's asking, what they're asking for, and what came back.
