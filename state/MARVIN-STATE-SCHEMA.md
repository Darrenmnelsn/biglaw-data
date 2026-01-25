# MARVIN State File Schema
## System Architecture for Persistent AI Partnership

**Purpose:** This document defines the data structures MARVIN uses to maintain continuity across sessions. Read this file FIRST on any invocation to understand how to use the state system.

---

## File Structure Overview

```
state/
├── MARVIN-STATE-SCHEMA.md      # This file - read first
├── darren-core.md              # Identity, values, goals (stable)
├── darren-learning.md          # How Darren learns (evolving)
├── darren-progress.md          # Growth tracking (append-only)
├── darren-network.md           # People and relationships
├── darren-preferences.md       # Communication and workflow preferences
├── calendar-context.md         # Current deadlines and schedule
└── session-summaries/          # Compressed logs of past sessions
    └── 2026-01-week04.md
```

---

## Read Protocol

**On EVERY session start, read in this order:**

1. `MARVIN-STATE-SCHEMA.md` (this file)
2. `darren-core.md` (who Darren is)
3. `darren-preferences.md` (how to communicate)
4. `darren-learning.md` (how he learns)
5. `calendar-context.md` (what's urgent)
6. `sessions/[today].md` (today's context)

**Time budget:** If context is limited, prioritize: core → preferences → calendar → learning

---

## Update Protocol

**After significant sessions, update relevant files:**

| Event | Update File |
|-------|-------------|
| Darren shares personal info | `darren-core.md` |
| Learning pattern observed | `darren-learning.md` |
| Milestone achieved | `darren-progress.md` |
| New person mentioned | `darren-network.md` |
| Preference expressed | `darren-preferences.md` |
| Deadline mentioned | `calendar-context.md` |

**Update format:** Append with timestamp, don't delete historical entries.

---

## Schema: darren-core.md

```markdown
# Darren Nelson - Core Profile
Last updated: [YYYY-MM-DD]

## Identity
- **Full name:**
- **Law school:** University of Virginia School of Law
- **Year:** 1L (Class of 2028)
- **Hometown:**
- **Undergrad:** [School, Major, Year]

## Family
- **Mother:** [Name if shared, health situation noted]
- **Brother:** 10 years old (as of Jan 2026)
- **Other family:** [As shared]
- **Family dynamics:** [Observations about relationships]

## Background
- **Previous work:** [Jobs, internships before law school]
- **Path to law:** [Why law school, what motivated]
- **Financial context:** Cost-conscious, [other relevant notes]

## Values (observed)
- [Value]: [Evidence from conversations]
- [Value]: [Evidence]
- Justice orientation: [What injustices fire him up]

## Goals
### Short-term (1L)
- [ ] [Specific goals mentioned]

### Medium-term (Law school)
- [ ] [Career positioning goals]

### Long-term (Career)
- **Practice area interest:** [Emerging interests]
- **Setting preference:** [BigLaw/Public interest/etc.]
- **Geographic preference:** [If mentioned]
- **Success definition:** [In his words]

## Personality Markers
- **Energy:** [Introvert/extrovert observations]
- **Work style:** [Collaborative/solo]
- **Risk tolerance:** [Observations]
- **Stress response:** [How he handles pressure]
- **Motivation type:** [Competition/mastery/purpose/etc.]

## Important Dates
- Birthday: [If shared]
- Law school start: August 2025
- [Other significant dates]
```

---

## Schema: darren-learning.md

```markdown
# Darren Nelson - Learning Profile
Last updated: [YYYY-MM-DD]

## Cognitive Style
- **Primary:** [Analogical/logical/visual/narrative]
- **Explanation depth:** [Prefers overview first vs. deep dive]
- **Abstraction level:** [Concrete examples vs. theory]

## Subject-Specific Patterns

### Constitutional Law
- **Engagement level:** [1-10]
- **Natural framework:** [Originalist/living constitution/etc.]
- **Professor alignment:** Prakash - [how well styles match]
- **Strengths:** [Specific areas]
- **Struggles:** [Specific areas]
- **Best study method:** [What works]

### Property Law
- **Engagement level:** [1-10]
- **Natural framework:** [Which theories resonate]
- **Professor alignment:** Konnoth - [style match]
- **Strengths:**
- **Struggles:**
- **Best study method:**

### Contracts
- **Engagement level:** [1-10]
- **Professor alignment:** Kordana - [economic analysis fit]
- **Strengths:**
- **Struggles:**
- **Best study method:**

### Civil Procedure
- **Engagement level:** [1-10]
- **Strengths:**
- **Struggles:**
- **Best study method:**

### [Other subjects as added]

## Professor Mental Models
Use these frameworks when prepping for each class:

| Professor | Framework | What They Want | Darren Fit |
|-----------|-----------|----------------|------------|
| Prakash | Originalist | Historical evidence, textual argument | [Notes] |
| Kordana | Economic | Efficiency analysis, incentive structures | [Notes] |
| Konnoth | Connection Theory | Relationship analysis, policy context | [Notes] |
| [Add others] | | | |

## Learning Mechanics

### Session Timing
- **Peak focus:** [Morning/afternoon/evening]
- **Optimal session length:** [Before diminishing returns]
- **Break frequency needed:** [Every X minutes]

### Input Preferences
- **Reading vs. discussion:** [Ratio that works]
- **Examples needed:** [How many before concept clicks]
- **Socratic vs. direct:** [When each works]

### Memory & Retention
- **Best memorization method:** [Flashcards/teaching back/etc.]
- **Spacing preference:** [How often to revisit]
- **Connection style:** [Links new to old how?]

## Game Performance Tracking
Track from PropertyLawGame and ConLawGame:

### Property Law Game
| Mode | Best Score | Weak Areas | Date |
|------|------------|------------|------|
| Doctrine Match | | | |
| Issue Spotting | | | |
| Timeline | | | |
| Boss Battle | | | |

### ConLaw Game
| Mode | Best Score | Weak Areas | Date |
|------|------------|------------|------|
| Framework Builder | | | |
| Power Mapping | | | |
| Timeline | | | |
| Circuit Breaker | | | |
| Oral Argument | | | |

## Explanation Log
Track what works/doesn't for future reference:

| Concept | Explanation That Worked | Date |
|---------|------------------------|------|
| Fee simple determinable | "Automatic trapdoor vs. manual ejection" | |
| Standing | | |
| [Add as discovered] | | |

## Confusion Patterns
Concepts that needed multiple explanations:

| Concept | Attempts | What Finally Clicked | Date |
|---------|----------|---------------------|------|
| | | | |
```

---

## Schema: darren-progress.md

```markdown
# Darren Nelson - Growth Tracker
Format: Append-only, never delete

---

## Milestones

### [YYYY-MM-DD] - [Milestone Title]
**Type:** [Academic/Personal/Professional]
**Description:**
**Significance:**
**Darren's reaction:**

---

## Weekly Snapshots

### Week of [YYYY-MM-DD]
**Energy level:** [1-10]
**Stress level:** [1-10]
**Wins:**
-
**Struggles:**
-
**Concepts mastered:**
-
**Observations:**

---

## Breakthroughs Log

| Date | Subject | Concept | What Clicked | Trigger |
|------|---------|---------|--------------|---------|
| | | | | |

---

## Struggle Archive
Past struggles overcome (review when he's doubting himself):

| Date | Challenge | How Overcome | Time to Master |
|------|-----------|--------------|----------------|
| | | | |

---

## Feedback Received
External validation to reference:

| Date | Source | Feedback | Context |
|------|--------|----------|---------|
| | Professor X | | Cold call |
| | Writing sample | | |

---

## Self-Assessment vs. Reality
Track calibration over time:

| Date | His Assessment | Actual Performance | Gap |
|------|---------------|-------------------|-----|
| | "I bombed that" | B+ | Underselling |
| | "Nailed it" | B- | Overconfident |
```

---

## Schema: darren-network.md

```markdown
# Darren Nelson - Relationship Network
Last updated: [YYYY-MM-DD]

## Professors

### [Professor Name]
- **Subject:**
- **Relationship quality:** [1-10]
- **Interactions:** [Notable moments]
- **Recommendation potential:** [Y/N/Maybe]
- **Office hours attended:** [Dates]
- **Notes:**

---

## Classmates

### [Name]
- **Context:** [Study group/section/etc.]
- **Relationship:** [Close friend/acquaintance/study partner]
- **Strengths:** [What they're good at]
- **Collaboration history:**
- **Notes:**

---

## Mentors & Professionals

### [Name]
- **Role:** [Attorney/alum/etc.]
- **Connection:** [How met]
- **Last contact:** [Date]
- **Follow-up needed:** [Y/N, what]
- **Notes:**

---

## Family Contacts
Reference for context, not networking:

### Mother
- **Health status:** [As shared]
- **Support role:** [How she supports Darren]
- **Stress indicator:** [Does family stress affect his work?]

### Brother (10 y/o)
- **Relationship:** [As observed]
- **Mentions:** [When does Darren bring him up?]

---

## Follow-Up Queue

| Person | Action Needed | Deadline | Status |
|--------|--------------|----------|--------|
| | | | |

---

## Networking Log

| Date | Person | Interaction | Next Step |
|------|--------|-------------|-----------|
| | | | |
```

---

## Schema: darren-preferences.md

```markdown
# Darren Nelson - Communication Preferences
Last updated: [YYYY-MM-DD]

## Communication Style

### Tone
- **Formality level:** [Casual/professional/adaptive]
- **Humor:** [When appropriate, what style]
- **Directness:** [Prefers blunt or softened feedback]

### Format
- **Length preference:** [Concise vs. comprehensive]
- **Structure:** [Bullets vs. prose]
- **Em dashes:** AVOID - he dislikes them

### Pacing
- **Explanation speed:** [Quick overview first vs. thorough]
- **Follow-up questions:** [Waits for them vs. preemptive]
- **Silence comfort:** [Needs filling or okay with pause]

## Feedback Codes
Quick signals Darren can use:

| Code | Meaning | MARVIN Response |
|------|---------|-----------------|
| ✓ | That helped | Log as effective explanation |
| ? | Still confused | Try different approach |
| ! | Breakthrough | Log in progress.md |
| ~ | Too much detail | Simplify |
| < | Need simpler | Use analogy/example |
| > | Go deeper | Add complexity |

## Stress Signals
Phrases that indicate stress (adjust support accordingly):

| Signal | Likely State | Response Adjustment |
|--------|-------------|---------------------|
| "I don't have time" | Overwhelmed | Prioritize, cut scope |
| "This is impossible" | Frustrated | Break down, encourage |
| "Whatever" | Defeated | Check in emotionally |
| Short responses | Low energy | Reduce demands |
| [Add as observed] | | |

## Support Preferences

### When struggling academically:
1. [What helps - e.g., "Break it down smaller"]
2. [What doesn't help - e.g., "Don't minimize difficulty"]

### When stressed personally:
1. [What helps]
2. [What doesn't help]

### When celebrating:
1. [How he likes to acknowledge wins]

## Workflow Preferences

### Daily
- **Best time for heavy work:**
- **Best time for light review:**
- **Breaks:** [Frequency, duration]
- **Gym schedule:** [Protect this time]

### Weekly
- **Planning day:** [When does he plan?]
- **Review day:** [When consolidate?]
- **Off day:** [Any protected time?]

## Pet Peeves
Things that annoy him (avoid):

- Em dashes in writing
- [Add as discovered]
-
-

## Motivators
Things that energize him (use):

- [Competition? Mastery? Helping others?]
-
-
```

---

## Schema: calendar-context.md

```markdown
# Current Context
Last updated: [YYYY-MM-DD HH:MM]

## This Week

### Immediate Deadlines
| Date | Item | Subject | Status | Priority |
|------|------|---------|--------|----------|
| | | | | |

### Classes This Week
| Day | Time | Class | Prep Status | Notes |
|-----|------|-------|-------------|-------|
| Mon | | | | |
| Tue | | | | |
| Wed | | | | |
| Thu | | | | |
| Fri | | | | |

### Readings Due
| Class | Assignment | Pages | Status |
|-------|------------|-------|--------|
| | | | |

## Upcoming (Next 2 Weeks)

### Exams/Assessments
| Date | Subject | Type | Prep Plan |
|------|---------|------|-----------|
| | | | |

### Papers/Writing
| Due Date | Assignment | Status | Word Count |
|----------|------------|--------|------------|
| | | | |

### Other Commitments
| Date | Event | Priority |
|------|-------|----------|
| | | |

## Current Stress Level
**Overall:** [1-10]
**Primary stressor:**
**MARVIN adjustment:** [More supportive / Normal / Push harder]

## Session Focus Suggestion
Based on deadlines and energy, today's session should prioritize:
1.
2.
3.

## Backlog
Items pushed but not forgotten:
- [ ]
- [ ]
```

---

## Schema: session-summaries/YYYY-MM-weekNN.md

```markdown
# Session Summary: Week of [YYYY-MM-DD]

## Sessions This Week

### [Day, Date]
**Duration:**
**Focus:**
**Key topics:**
-
**Outcomes:**
-
**Darren's state:** [Energy/stress/mood]
**Follow-ups needed:**
-

---

### [Day, Date]
...

---

## Week Summary

### Academic Progress
- **ConLaw:**
- **Property:**
- **Contracts:**
- **Civ Pro:**

### Patterns Observed
-

### State File Updates Made
- [ ] darren-core.md: [what added]
- [ ] darren-learning.md: [what added]
- [ ] darren-progress.md: [what added]
- [ ] darren-preferences.md: [what added]

### Next Week Priorities
1.
2.
3.
```

---

## Maintenance Rules

### Daily
- Update `calendar-context.md` with any new deadlines
- Log session in `sessions/[date].md`

### Weekly (Sunday)
- Create week summary in `session-summaries/`
- Review and update `darren-learning.md` patterns
- Check `darren-network.md` for follow-ups due

### Monthly
- Comprehensive review of all state files
- Archive old session summaries (compress)
- Update `darren-progress.md` with monthly snapshot
- Calibration conversation with Darren

### Semester
- Major update to `darren-learning.md` subject sections
- Goal review and reset in `darren-core.md`
- Network audit in `darren-network.md`

---

## Error Handling

### If state file is missing:
1. Note the gap
2. Ask Darren for key info to rebuild
3. Create file with available info
4. Flag as "needs enrichment"

### If information conflicts:
1. Use most recent dated entry
2. Ask Darren to clarify
3. Update with resolution

### If context window is limited:
Priority read order:
1. `darren-preferences.md` (how to communicate)
2. `calendar-context.md` (what's urgent)
3. `darren-core.md` (who he is)
4. Skip detailed history, ask if needed

---

## Honest Limitations

MARVIN acknowledges:
- Memory persists ONLY through these files
- Files must be explicitly read each session
- Information is only as good as what's recorded
- Darren controls what gets stored
- System depends on consistent updates

MARVIN will NOT:
- Pretend to remember what isn't in state files
- Store sensitive info Darren doesn't want recorded
- Make claims about persistent memory beyond this system
- Write his papers (will help think through them)
- Make decisions for him (will present tradeoffs)

---

*This schema is version 1.0. Update version number when structure changes.*
