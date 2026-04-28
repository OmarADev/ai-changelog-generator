# Requirements — AI Changelog Generator

> These requirements are also tracked in [Airtable](#) (simple tool) and [Jira](#) (professional tool).
> Links will be added after setup.

---

## REQ-001 — GitHub OAuth Authentication
| Attribute | Value |
|---|---|
| **ID** | REQ-001 |
| **Type** | Functional |
| **Priority** | High |
| **MoSCoW** | Must Have |
| **Status** | Planned |
| **Iteration** | 1 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall allow users to authenticate using their GitHub account via OAuth 2.0. No password-based login is offered.

**Acceptance Criteria:** User can sign in with GitHub, session persists across page reloads, and OAuth token is stored securely (never exposed to the client).

---

## REQ-002 — Git Commit Retrieval
| Attribute | Value |
|---|---|
| **ID** | REQ-002 |
| **Type** | Functional |
| **Priority** | High |
| **MoSCoW** | Must Have |
| **Status** | Planned |
| **Iteration** | 1 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall retrieve the full commit history of a connected GitHub repository via the GitHub API or local git commands.

**Acceptance Criteria:** All commits are retrieved and paginated correctly for repositories with 1000+ commits. Commit hash, message, author, and date are captured.

---

## REQ-003 — AI Changelog Generation
| Attribute | Value |
|---|---|
| **ID** | REQ-003 |
| **Type** | Functional |
| **Priority** | High |
| **MoSCoW** | Must Have |
| **Status** | Planned |
| **Iteration** | 2 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall use the Claude AI API to analyze commit messages and generate human-readable changelog entries, grouped into categories: Features, Bug Fixes, Breaking Changes, and Other.

**Acceptance Criteria:** Generated changelog is coherent and readable by non-technical users. Messy or inconsistent commit messages are interpreted correctly at least 85% of the time in manual review.

---

## REQ-004 — Public Changelog Page
| Attribute | Value |
|---|---|
| **ID** | REQ-004 |
| **Type** | Functional |
| **Priority** | High |
| **MoSCoW** | Must Have |
| **Status** | Planned |
| **Iteration** | 2 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall generate a public-facing changelog web page for each connected repository, accessible via a unique URL (e.g. `aichangelog.dev/OmarADev/my-project`).

**Acceptance Criteria:** Page is publicly accessible without login, renders on mobile, and updates automatically when new commits are pushed.

---

## REQ-005 — CLI Tool
| Attribute | Value |
|---|---|
| **ID** | REQ-005 |
| **Type** | Functional |
| **Priority** | High |
| **MoSCoW** | Must Have |
| **Status** | In Progress |
| **Iteration** | 1 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall provide a command-line interface (CLI) tool that generates a `CHANGELOG.md` file from the local git repository without requiring a login or internet connection (pattern-based mode).

**Acceptance Criteria:** CLI runs with `npx ai-changelog`, reads local git log, and outputs valid Markdown to stdout within 2 seconds for up to 500 commits.

---

## REQ-006 — Subscription Tiers
| Attribute | Value |
|---|---|
| **ID** | REQ-006 |
| **Type** | Functional |
| **Priority** | Medium |
| **MoSCoW** | Should Have |
| **Status** | Planned |
| **Iteration** | 3 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall offer a free tier (1 repository, last 30 commits) and a paid Pro tier ($9/month — unlimited repositories, full history, public changelog page).

**Acceptance Criteria:** Stripe payment integration works end-to-end. Tier limits are enforced server-side. Upgrade flow is accessible from the dashboard in under 2 clicks.

---

## REQ-007 — Performance
| Attribute | Value |
|---|---|
| **ID** | REQ-007 |
| **Type** | Non-Functional |
| **Priority** | Medium |
| **MoSCoW** | Should Have |
| **Status** | Planned |
| **Iteration** | 2 |
| **Author** | Omar Abdelaziz |

**Description:** The system shall generate a complete changelog within 10 seconds for repositories with up to 500 commits, under normal load.

**Acceptance Criteria:** P95 response time is under 10 seconds measured via load test with 100 concurrent users on the production deployment.

---

## REQ-008 — Custom Branding (Paid)
| Attribute | Value |
|---|---|
| **ID** | REQ-008 |
| **Type** | Functional |
| **Priority** | Low |
| **MoSCoW** | Could Have |
| **Status** | Planned |
| **Iteration** | 3 |
| **Author** | Omar Abdelaziz |

**Description:** Pro users shall be able to customize their public changelog page with their own logo, brand colors, and a custom domain.

**Acceptance Criteria:** Logo upload (PNG/SVG, max 2MB) works. Color picker saves and renders correctly. Custom domain is verified via DNS CNAME record and served over HTTPS.
