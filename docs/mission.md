# Mission: AI Changelog Generator

**Version:** 1.0
**Author:** Omar Abdelaziz
**Last updated:** 2026-05-05

> *Built iteratively through structured Q&A with Claude AI. Questions, decisions, and reasoning are documented below.*

---

## Vision

To become the tool solo developers reach for automatically when they ship, making "write the changelog" disappear as a task entirely.

---

## Mission

Build an AI-powered changelog generator that reads a repository's git commit history and produces a clear, human-readable changelog so developers can ship faster and their users actually understand what changed.

---

## The Problem

Developers hate writing changelogs. Not because they're lazy: changelog writing sits in an awkward middle ground, too important to skip, too tedious to do well. The result is one of three failure modes:

1. **The wall of commits:** auto-generated list of every commit message, unreadable by anyone outside the team
2. **The empty section:** "see GitHub releases" links to a page with no content
3. **The missing changelog:** nothing, forever, until someone complains

Existing tools (Release Drafter, GitHub auto-release notes, Keep a Changelog) don't solve this: they automate the wall-of-commits problem rather than fixing it. They scrape PR titles and commit messages verbatim. Garbage in, garbage out.

---

## Who It's For

**Primary user:** Solo developers and indie hackers maintaining public-facing software: open source libraries, side projects, SaaS products.

They share three traits:
- They ship frequently and alone, with no dedicated technical writer
- Their changelogs are public artifacts read by real users and potential contributors
- They have zero tolerance for tools that add friction without saving real time

**Why this user first:** Solo developers are the best distribution channel in software. They tweet, post on Hacker News, and evangelize tools they love to their teams at day jobs. A product that wins solo devs builds its own growth engine.

---

## The Value Proposition

Every time a user reads a well-written changelog, they trust the product more. They know what changed, whether to update, and that someone cares about communicating clearly.

This tool makes that happen automatically, not by dumping commits, but by understanding what actually changed and writing it in plain language.

**The measurable outcome:** A developer who ships weekly spends ~20 minutes per release writing changelogs manually. This tool reduces that to under 60 seconds.

---

## Core Values

| Value | In practice |
|---|---|
| **Honesty** | Don't oversell. Current iteration does commit-message analysis. Diff-level understanding comes later. We say so. |
| **User-first output** | The changelog is read by users, not developers. Every output decision is made from the reader's perspective. |
| **Zero friction** | One command. No config required to get started. Complexity is opt-in. |
| **Earned trust** | Features ship when they work, not when they're announced. |

---

## What This Is Not

- Not a project management tool
- Not a commit linting tool
- Not a replacement for good commit hygiene (though it tolerates bad hygiene better than anything else)
- Not built for internal-only tools where no one outside the team reads the changelog

---

## AI Usage Note

This document was developed through a structured dialogue with Claude AI. The product positioning, target user definition, and value framing were refined through iterative Q&A: each answer challenged and sharpened before being written into this doc. The final decisions and language are the author's own.
