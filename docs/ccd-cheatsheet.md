# Clean Code Development: Personal Cheat Sheet

*Omar Abdelaziz — AI Changelog Generator*

---

| # | Principle | Definition |
|---|-----------|------------|
| 1 | **Single Responsibility** | Every function/class has one reason to change. If you say "and" describing it, split it. |
| 2 | **Meaningful Names** | Name things what they are. `commits` beats `arr`. A good name makes a comment unnecessary. |
| 3 | **Small Functions** | If you can't read the whole function in one glance, it does too much. |
| 4 | **Pure Functions** | Depend only on inputs, affect only outputs. No hidden state, no side effects. |
| 5 | **Fail Fast** | Validate at the boundary. Exit early with a clear message. Don't let bad state travel deep. |
| 6 | **DRY** | Don't Repeat Yourself. Duplication means two places to update — one will be forgotten. |
| 7 | **Comments: WHY not WHAT** | Code shows what. Comments explain why a non-obvious decision was made. |
| 8 | **Consistent Formatting** | Use a linter. Automate style so you never think about it. |
| 9 | **Early Returns** | Guard clauses at the top keep the happy path at the left margin and flatten nesting. |
| 10 | **No Magic Numbers** | `const SHORT_HASH_LENGTH = 7` beats a raw `7`. Named constants explain what the value means. |
| 11 | **One Level of Abstraction per Function** | Don't mix high-level logic with low-level detail in the same function. |
| 12 | **Avoid Output Arguments** | Don't pass an object in just to mutate it. Return a new value instead. |

---

*Export this file to PDF: open in browser, File > Print > Save as PDF.*
