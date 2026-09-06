---
title: "Evals 101: A Practical Guide to Evaluating AI Agents"
desc: "Learn what AI evals and scorers are, how code-based and LLM-as-a-judge scorers work, and how offline and online evaluations improve AI agent quality."
metaTitle: "Evals 101: A Practical Guide to Evaluating AI Agents"
metaDescription: "Learn what AI evals and scorers are, how code-based and LLM-as-a-judge scorers work, and how offline and online evaluations improve AI agent quality."
keywords:
  - AI evals
  - AI evaluation
  - AI agent evaluation
  - LLM evaluation
  - AI testing
  - LLM-as-a-judge
  - AI scorers
  - automated evals
  - offline evals
  - online evals
  - AI observability
  - golden dataset
  - AI regression testing
  - agent testing
  - evaluation framework
date: 2026-09-06
ispublished: true
author: "Bedanta Gogoi"
categories:
  - AI
---
AI agents can produce different outputs for the same or similar inputs, making traditional software testing techniques insufficient on their own. This is where **AI evaluations (evals)** come in.

Evals help teams systematically determine whether an AI agent is behaving as expected. They can be used during development to catch regressions and in production to monitor how an agent performs with real users.

This guide explains the fundamentals of AI evals, scorers, traces, datasets, and the difference between offline and online evaluation.

## What Are AI Evals?

An **eval** is the discipline of evaluating an AI system to determine whether it produces the expected behavior or outcome.

You may already be doing evals without realizing it.

For example, suppose you build a weather agent and ask:

> "What is the weather in London?"

You inspect its response and decide whether it is accurate. That is a **manual evaluation**.

The problem is scalability. Manually reviewing every AI response becomes impractical as usage increases. Automated evals allow the evaluation process to happen systematically.

Evals are therefore more than a single test or metric. They represent a broader discipline involving different evaluation techniques, scoring methods, datasets, and feedback loops.

## What Is a Scorer?

A **scorer** is an automated mechanism that evaluates an AI agent's execution.

A scorer typically runs against a **trace**, which is a record of what happened during an agent run.

A trace can contain information such as:

- User inputs
- Agent outputs
- System instructions
- Message history
- LLM calls
- Tool calls
- Individual execution spans

This is important because evaluating an AI agent is not always about checking its final response. Sometimes the agent's internal behavior matters just as much.

For example, if a weather agent must always call a weather API to retrieve fresh information, a scorer can inspect the trace and determine whether the correct tool was called.

## Scorer vs. Test: What's the Difference?

From a software engineering perspective, an automated scorer can look very similar to a test. In practice, AI evals often function as a form of **regression testing**.

The important difference is that AI systems are frequently **stochastic** or non-deterministic. The exact output can vary from one run to another.

For example:

- A weather response changes as the weather changes.
- A generated poem can have many valid forms.
- An AI assistant may phrase the same correct answer differently.

Instead of checking whether the output exactly matches one expected string, AI evals often evaluate whether the result satisfies a desired criterion.

So, AI evals are fundamentally related to testing, but they require evaluation techniques suited to probabilistic and generative systems.

## Two Main Types of Scorers

There are two important categories of automated scorers:

1. **Code-based scorers**
2. **LLM-as-a-judge scorers**

### 1. Code-Based Scorers

A code-based scorer uses deterministic code to evaluate an agent trace.

For example, suppose a weather agent should call a weather tool whenever it receives a request for current weather information.

A code-based scorer can inspect the trace and check:

- Was the weather tool called?
- Was it called the expected number of times?
- Were other tools called?
- Did the agent follow a specific execution rule?

This approach is useful when the desired behavior can be expressed clearly in code.

### Advantages of Code-Based Scorers

**Fast:** Code executes quickly.

**Low cost:** There is no additional LLM inference cost.

**Deterministic:** The same trace produces the same score.

**Easy to automate:** They work well in continuous integration and regression testing workflows.

Code-based scorers are particularly useful for evaluating behavior that is objectively observable in a trace.

### 2. LLM-as-a-Judge Scorers

Some qualities are difficult to express using traditional code.

Consider a requirement such as:

> "The agent should respond like a formal, professional weather presenter."

It is possible to create rules for individual words or patterns, but that approach can be brittle. Instead, another LLM can evaluate the response against the desired criteria.

This approach is called **LLM-as-a-judge**.

The judge model receives the relevant information and produces a score and, optionally, a reason explaining its decision.

LLM judges can be useful for evaluating qualities such as:

- Tone of voice
- Relevance
- Helpfulness
- Response quality
- Toxicity
- Adherence to instructions
- Similarity to a desired answer

### Why Use a Smaller Model as the Judge?

The reference material highlights a practical strategy: a smaller, less expensive model can often be used to judge outputs rather than using the most capable model available.

This matters because evaluation itself consumes compute and tokens. If an application generates thousands of traces, running an expensive model as a judge on every trace can quickly become costly.

## What Is a Golden Dataset?

An AI evaluation becomes much more useful when it is run against a consistent set of scenarios.

A **golden dataset** is a curated collection of representative examples that can be used to evaluate an agent repeatedly.

For example, a weather agent's dataset might contain:

- A first-time weather question
- A follow-up weather question
- Requests involving different locations
- Scenarios requiring a tool call
- Previously observed failure cases

You can run the agent against these examples and apply your scorers to measure how its behavior changes over time.

## Offline Evals and Regression Testing

**Offline evaluation** means running scorers against existing traces or a predefined dataset.

A common workflow is:

1. Create a dataset containing representative scenarios.
2. Run the current version of the AI agent against the dataset.
3. Apply your scorers.
4. Record the results.
5. Change the agent, prompt, tools, or context.
6. Run the evaluation again.
7. Compare the results.

This creates an AI-specific regression testing workflow.

For example, a prompt change might improve response tone but accidentally cause the agent to stop calling a required tool. A dataset-based evaluation can expose that regression.

Offline evals can also be incorporated into a **continuous integration (CI)** process, although they may be slower and more expensive than conventional unit tests, particularly when LLM-as-a-judge scoring is involved.

## Online Evals: Monitoring AI in Production

Offline evaluation cannot capture every way real users interact with an AI system.

Once an agent is in production, users may provide unexpected inputs and follow workflows that were never included in the original dataset.

This is where **online evals** become valuable.

Online scorers run against real production traces, often close to real time. This makes them feel less like traditional testing and more like **AI observability and monitoring**.

A production evaluation system can help teams track:

- Evaluation scores over time
- Changes in agent behavior
- Potential quality degradation
- Toxic or inappropriate outputs
- Tool-use problems
- Changes caused by prompts or context engineering

If a score starts declining, the team can investigate the underlying traces and determine what changed.

## Why Sampling Matters for Online Evals

Running an LLM-as-a-judge scorer on every production trace can become expensive.

For example, an application with thousands of users may generate a large number of traces every day. Evaluating every trace with an additional LLM call could consume substantial tokens.

**Sampling** provides a practical solution.

Instead of evaluating 100% of traces, a team might evaluate a selected percentage, such as:

- 25%
- 50%
- 75%
- 100%

The appropriate sampling rate depends on the evaluation's cost, importance, and required monitoring coverage.

Code-based scorers can generally be run much more frequently because they are inexpensive compared with LLM-based evaluation.

## Build an Eval Loop

A strong AI evaluation strategy should not stop at assigning scores.

One of the most useful practices is to turn real failures into new evaluation cases.

The process can look like this:

**Production failure → Review trace → Add to dataset → Improve agent → Re-run eval → Verify fix**

Suppose a user discovers an unexpected failure in production. Instead of fixing the issue and moving on, save that trace as a dataset item.

The next time the agent changes, that scenario becomes part of the evaluation suite.

Over time, the dataset becomes increasingly representative of the real failure modes of the product.

The reverse can also happen: an evaluation may pass even though the result is clearly bad. That indicates that the scorer itself needs improvement.

This creates an iterative loop involving both **agent improvement and scorer improvement**.

## Best Practices for AI Evals

### 1. Start With Fundamentals

Don't begin with sophisticated evaluation infrastructure before defining what good behavior means.

Start by identifying the behaviors that matter most.

### 2. Evaluate Behavior, Not Just Final Output

Inspect traces when appropriate. Tool calls, execution steps, and other spans can reveal problems that are invisible in the final response.

### 3. Prefer Code When the Rule Is Deterministic

If something can be reliably expressed in code, a code-based scorer is usually faster, cheaper, and easier to reason about.

### 4. Use LLM Judges for Subjective Qualities

Use LLM-as-a-judge when evaluating qualities such as tone, relevance, or overall response quality that are difficult to express with deterministic rules.

### 5. Keep Scores Interpretable

A score should communicate something useful.

A simple pass/fail result can sometimes be more meaningful than an arbitrary numerical score such as 0.5 versus 0.6.

### 6. Create Datasets From Real Failures

Production failures are valuable evaluation cases. Adding them to your dataset helps prevent the same problems from returning after future changes.

### 7. Monitor Production Behavior

Offline evals cannot represent every real-world interaction. Online evaluation provides visibility into how the system behaves with actual users.

## Conclusion

AI evals are an essential part of building reliable AI agents. They provide a structured way to determine whether an agent behaves correctly, identify regressions, and monitor performance after deployment.

The core concepts are straightforward:

- **Evals** are the broader discipline of evaluating AI systems.
- **Scorers** are automated mechanisms used to evaluate agent runs.
- **Traces** provide the execution record that scorers can inspect.
- **Code-based scorers** are useful for deterministic behaviors.
- **LLM-as-a-judge scorers** help evaluate subjective or language-based qualities.
- **Offline evals** are useful for regression testing against datasets.
- **Online evals** help monitor real production behavior.
- **Eval loops** turn failures into future test cases and continuously improve the system.

The goal should not be to build evals simply because AI products are expected to have them. The goal is to build **productive evaluations that answer meaningful questions about whether your AI system is actually working**.

---

## Frequently Asked Questions

### What is an AI eval?

An AI eval is a systematic way to evaluate whether an AI model or agent produces the desired behavior or outcome.

### What is a scorer in AI evaluation?

A scorer is an automated function or model-based evaluator that examines an AI agent's trace and produces a score or decision about its behavior.

### What is LLM-as-a-judge?

LLM-as-a-judge uses one language model to evaluate the output of another AI system against defined criteria such as relevance, tone, or quality.

### Are AI evals the same as software tests?

AI evals are closely related to regression testing, but AI systems often produce stochastic outputs. Therefore, evaluation usually focuses on behavioral criteria rather than exact output matching.

### What is the difference between online and offline evals?

Offline evals run against existing traces or predefined datasets, typically during development. Online evals run against production traces to monitor an AI system as users interact with it.

### Why are golden datasets important?

Golden datasets provide consistent evaluation scenarios that can be reused after changes to prompts, models, tools, or agent logic, making it easier to identify regressions.
