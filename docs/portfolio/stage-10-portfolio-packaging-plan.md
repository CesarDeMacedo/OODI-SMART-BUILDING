# Stage 10 — Portfolio Packaging Plan

## Purpose

Package the completed MVP as a professional Digital Advisory portfolio case study.

This stage produces documentation, screenshots and structured content that can be used for a professional case-study PDF, the Black Lab Visuals portfolio website, LinkedIn posts and WSP Digital Advisory applications and conversations.

No application features, data logic, layouts or approved content will be modified in this stage.

---

## Primary Audience

- WSP Digital Advisory
- WSP Property & Buildings
- Digital strategy, smart-building and infrastructure professionals
- Recruiters and hiring managers

---

## Required Outputs

| Output | File or Location |
|---|---|
| Stage 10 plan | `docs/portfolio/stage-10-portfolio-packaging-plan.md` |
| Case-study narrative | `docs/portfolio/oodi-case-study-content.md` |
| Technical architecture summary | `docs/portfolio/oodi-technical-summary.md` |
| Screenshot shot list | `docs/portfolio/oodi-screenshot-shot-list.md` |
| Desktop screenshots (7) | `portfolio-assets/screenshots/` |
| Mobile screenshots (3) | `portfolio-assets/screenshots/` |
| Screenshot capture script | `e2e/portfolio-screenshots.spec.ts` |
| Project context update | `docs/context/project-context-oodi.md` |

---

## Constraints

- No unsupported operational claims
- No implication of official affiliation with Oodi, the City of Helsinki, Nuuka, Open-Meteo or WSP
- No fabricated ROI, energy savings or performance outcomes
- No claim that conceptual IoT data is live or connected to a real BMS
- No claim that AI generates runtime insights in the deployed application
- No application source files changed unless required for a minimal screenshot automation script

---

## Data Classification — Must Be Preserved Throughout

| Layer | Source | Classification |
|---|---|---|
| Utility data | Helsinki Nuuka Open API | Real public building data |
| Weather data | Open-Meteo | Current public weather data |
| IoT / operational indicators | Local deterministic dataset | Conceptual IoT — prototype data |

---

## Stage 10 Deliverable Status

- [x] `stage-10-portfolio-packaging-plan.md` — this file
- [x] `oodi-case-study-content.md`
- [x] `oodi-technical-summary.md`
- [x] `oodi-screenshot-shot-list.md`
- [x] `e2e/portfolio-screenshots.spec.ts` — Playwright capture script
- [x] `portfolio-assets/screenshots/` — output directory created
- [ ] Screenshots captured and visually validated
- [ ] Commit and push to `origin/main`
