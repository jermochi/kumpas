<div align="center">
  <img src="docs/assets/kumpas-logo.png" alt="Kumpas Logo" width="250"/>

  # Kumpas
  **Multi-Agent Career Assessment Tool**

  [![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
  [![Django](https://img.shields.io/badge/Django-Backend-092E20.svg)](https://www.djangoproject.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-Frontend-black.svg)](https://nextjs.org/)
</div>

---

## Overview

Kumpas is an automated career assessment platform designed to assist guidance counselors and students. The system synthesizes quantitative and qualitative student data to provide a holistic evaluation. It accepts images of National Achievement Test (NAT) and National Career Assessment Examination (NCAE) results, alongside textual career interview notes provided by guidance counselors.

By processing this combined data through a multi-agent architecture, the application is structured to support **UN Sustainable Development Goal 8 (SDG 8)**, promoting inclusive, sustainable economic growth and decent work through optimized, data-backed career pathing.

## Core Analysis Modules

The application utilizes three distinct analytical agents to evaluate the ingested student data:

* **Feasibility Assessment:** Evaluates raw cognitive and aptitude metrics from the NAT and NCAE, supplemented by the counselor's notes on student interests and academic history, to determine the academic and technical viability of specific career tracks.
* **Labor Market Analysis:** Cross-references the student's academic profile with current economic trends, industry demands, and employment forecasts to ensure recommended paths are economically viable.
* **Job-Demands-Resources (JDR) Evaluation:** Applies the JDR psychological model to assess the occupational context. This agent heavily utilizes the qualitative counselor interview notes to gauge a student's personal resources and stress tolerance, balancing the inherent demands of a profession against available resources to recommend sustainable career paths.

## System Workflow

1.  **Data Ingestion:** Users upload image files (JPEG, PNG, PDF) of official NCAE and NAT documents, and input or upload qualitative career interview notes from the counselor.
2.  **Processing & Extraction:** * The OCR engine parses the physical documents, extracting scores, percentiles, and categorical data.
    * Concurrently, a natural language processing module parses the counselor interview notes to extract behavioral markers, personal preferences, and psychological insights.
3.  **Data Structuring:** Both the quantitative test data and qualitative interview insights are formatted into a standardized, unified JSON payload.
4.  **Agent Routing:** The structured payload is processed concurrently by the Feasibility, Labor, and JDR agents.
5.  **Synthesis:** The system compiles the outputs from the three agents into a cohesive, step-by-step guidance report for the user.

## Technology Stack

* **Frontend:** Next.js, TypeScript
* **Backend:** Django, Python
* **Processing:** Python-based multi-agent architecture
* **Data Extraction:** Tesseract OCR (or equivalent configured engine) and qualitative text processing modules.

## Local Development Setup

### Prerequisites

* Python 3.10 or higher
* Node.js 18 or higher
* Tesseract OCR installed on the host machine

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-org/kumpas.git](https://github.com/your-org/kumpas.git)
    cd kumpas
    ```

2.  **Configure the Backend (Django)**
    ```bash
    cd backend
    python -m venv venv
    
    # Activate virtual environment
    # Linux/macOS: source venv/bin/activate
    # Windows: venv\Scripts\activate
    
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Configure the Frontend (Next.js)**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

4.  **Environment Variables**
    Create a `.env` file in both the `backend` and `frontend` directories. Refer to `.env.example` in each respective directory for the required API keys and database connection strings.
