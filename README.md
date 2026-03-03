<div align="center">
  <img src="docs/assets/kumpas-logo.png" alt="Kumpas Logo" width="250"/>

  # Kumpas
  **A Multi-AI Specialists Career Assessment System Powered by Student Academic Records**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
  [![Gemini](https://img.shields.io/badge/Gemini-API-blue.svg)](https://ai.google.dev/)
  [![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://vercel.com/)
</div>

---

## Overview

Kumpas generates structured career assessment reports from a student's existing academic data — NCAE results, NAT scores, and counselor notes — using a five-AI pipeline built on Next.js and the Gemini API.

By processing this combined data through a multi-ai specialist architecture, Kumpas supports **UN Sustainable Development Goal 8 (SDG 8)** — promoting decent work and inclusive economic growth through data-backed career guidance.

Built for guidance counselors. Paid for by schools. Free for students.

---

## Application Preview

### Landing Page
![Kumpas Landing Page](docs/assets/landing-page.png)
*The main entry point for guidance counselors.*

### Data Input Interface
![Kumpas Input Page](docs/assets/input-page.png)
*Upload interface for NCAE/NAT documents and counselor notes.*

### Analysis Page
![Kumpas Analysis Page](docs/assets/analysis-page.png)
*Analysis results page.*

### Mobile UI
<div align="center">
  <img src="docs/assets/mobile/landing-page.png" alt="Mobile UI 1" width="200"/>
  <img src="docs/assets/mobile/input-page.png" alt="Mobile UI 2" width="200"/>
  <img src="docs/assets/mobile/input-page-2.png" alt="Mobile UI 3" width="200"/>
  <img src="docs/assets/mobile/analysis-page.png" alt="Mobile UI 4" width="200"/>
</div>

*Mobile application interface preview.*

---

## How It Works

### Input
Counselors upload three things:
- **NCAE results** — image (JPEG, PNG, PDF)
- **Report card or NAT scores** — image (JPEG, PNG, PDF)
- **Counselor notes** — typed freehand or uploaded as an image

### Pipeline

**1. Vision Layer**
Gemini's native multimodal vision reads and parses all uploaded documents — extracting scores, percentiles, and qualitative notes — and structures everything into a unified format for the downstream specialists.

**2. Core Analysis — 3 AI Specialists in Parallel**

| AI Specialist | Framework | Question Answered |
|---|---|---|
| Feasibility Analyst | SCCT (Social Cognitive Career Theory) | Can this student realistically get there? |
| Labor Market Analyst | LMI (Labor Market Information) | Is this career viable in the Philippine job market? |
| Job Demand Analyst | JD-R (Job Demands-Resources Model) | Will this career burn them out? |

Each AI specialist is independently prompted and grounded in its own framework and dataset.

**3. Adjacency Layer**
Synthesizes all three AI specialists outputs and surfaces alternative career paths for the counselor to explore with the student.

**4. Output**
- Per-specialist reports with key signals, interpretations, and supporting data
- Score breakdown by academic area
- Counselor note review panel
- One-click PDF summary export for the student

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend & Backend | Next.js |
| AI & Vision | Gemini API (multimodal) |
| Deployment | Vercel |

No separate backend server. No OCR library. Vision and analysis are handled entirely through Gemini's multimodal API via Next.js API routes.

---

## Validation

Kumpas's input structure and AI specialists outputs have been reviewed and validated by guidance counselors at Cebu Institute of Technology – University (CIT-U).

---

## Business Model

- **B2B SaaS** — schools subscribe, counselors use it, students pay nothing
- **Pricing** — scaled by student enrollment
- **Cost per session** — ₱3.50 per student analysis run
- **Data partnerships** — anonymized career data shared with DOLE and CHED to inform national youth programs

### Market
- **SOM** — 50 private schools in Cebu (beachhead: CIT-U)
- **SAM** — 150 schools across Region 7
- **TAM** — 2,500 Senior High Schools nationwide

---

*Turning Data into Direction.*