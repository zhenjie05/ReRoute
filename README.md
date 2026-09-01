<div align="center">

# 🧭 ReRoute

### *The trip room that plans with you, travels with you, and never leaves you stranded.*

[![CodeNection 2026](https://img.shields.io/badge/CodeNection-2026-14b8a6?style=for-the-badge)](https://itsocietymmu.com/codenection-2026)
[![Track](https://img.shields.io/badge/Track-Lifestyle%20%26%20Personal%20Productivity-orange?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Status-Prototype%20Phase-yellow?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

[Prototype](#-prototype) · [Demo Video](#-demo-video) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Team](#-team)

</div>

---

## 🌊 What is ReRoute?

Planning a trip means juggling flights, budgets, itineraries, and everyone's clashing preferences — usually scattered across five apps and a group chat. The moment something changes mid-trip, every existing tool goes silent.

**ReRoute fixes this by giving every trip a living room.** One shared space that plans the trip, mediates group decisions, adapts in real time when things go wrong, splits the bill, and remembers the trip once it's over.

> Built for **CodeNection 2026**, hosted by MMU IT Society — Lifestyle Track, *Planning an Escape*.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🗺️ AI Route Planning & 3D Landmarks
AI-generated optimal routes with live ETAs, transport comparisons, instant rerouting, and tap-to-explore 3D landmark previews with historical context.

### 🛡️ Safety & Security Check
AI monitors current local news for conflict, disasters, or unrest and proactively flags risk before it becomes a problem.

### 🏠 Trip Rooms
A dedicated room per trip with anonymous voting, per-attraction comments, group chat, and opt-in live location sharing.

### 💸 Splitwise-Style Expense Splitting
Log expenses your way — equal, percentage, shares, or exact — scan receipts with AI/OCR, and let debt-simplification handle the messy settle-up math.

</td>
<td width="50%" valign="top">

### 🤖 AI-Suggested Itineraries
Home page recommendations built from anonymized patterns across all travelers — inspiration without starting from scratch.

### 🆘 Emergency SOS
One tap alerts your whole group with your location *and* quick-dials the correct local emergency number, wherever you are.

### 🗣️ Destination Language Mini-Lessons
Bite-sized, Duolingo-style lessons scoped to real travel scenarios — ordering food, directions, emergencies.

### 📸 Group Album & 👥 Community
Auto-organized shared photo albums, plus a social feed to follow other travelers and clone itineraries you love.

</td>
</tr>
</table>

---

## 🧠 Why ReRoute is different

Most travel apps stop at *planning*. ReRoute treats **disruption handling and group conflict as the same problem** — both get resolved through the same in-chat decision-card mechanism, whether it's "our flight got delayed" or "half of us want to leave early." One system, two triggers, and a much smaller app to build and reason about.

---

## 🛠️ Tech Stack

![React Native](https://img.shields.io/badge/React%20Native-Expo-20232a?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20PostGIS-3ecf8e?style=flat-square&logo=supabase)
![Google Maps](https://img.shields.io/badge/Google%20Maps-Directions%20%26%20Places-4285F4?style=flat-square&logo=googlemaps)
![AI](https://img.shields.io/badge/AI-Claude%20%2F%20OpenAI-8a2be2?style=flat-square)

| Layer | Choice |
|---|---|
| Frontend | React Native (Expo) |
| Backend | Supabase — Postgres + PostGIS, Auth, Realtime, Storage |
| Maps | Google Maps API |
| AI / OCR | Claude or OpenAI API *(final choice TBD)* |

---

## 📂 Repo Structure

```
reroute/
├── README.md
├── docs/
│   ├── feature-requirements.md   # full feature specs & data model
│   └── idea-report.md            # original concept write-up
├── ideation/
│   └── ...                       # mindmap, mentor feedback, pivot log
└── design/
    └── ...                       # prototype screenshots / exports
```

---

## 🎨 Prototype

🔗 *[Design prototype link — add once built]*

## 🎬 Demo Video

🔗 *[YouTube link — add once recorded]*

---

## 🗓️ Ideation Journey

> A quick log of how ReRoute evolved — see [`ideation/`](ideation/) for the full mindmap and mentor session notes.

- **v1:** Started as a disruption-handling travel planner ("ReRoute")
- **v2:** Added group mediation for social conflict, borrowed from a separate "group vibe matching" concept
- **v3:** Unified both under one Trip Room, reusing the same decision-card mechanism for both triggers
- **v4:** Added Splitwise-style budgeting with AI receipt scanning, Community sharing layer, SOS, and language learning

---

## 👥 Team

| Name | Role |
|---|---|
| *Lee Zhen Jie* | Team Leader |
| *Gan Rui En* | *Member* |
| *Hong Jia Bao* | *Member* |

---

## 🙏 Acknowledgments

Built for **CodeNection 2026**, organized by **IT Society MMU**, co-organized by **Meta-Learning**, and sponsored by **Cyberview** and **Printcious**. Thanks to our mentors for their feedback during the prototype phase.

<div align="center">

*Made with 🧭 and too little sleep.*

</div>
