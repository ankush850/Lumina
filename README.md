<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status" />
  <img src="https://img.shields.io/badge/Version-2.3.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License" />
   <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" alt="Python Badge" />
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI Badge" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5 Badge" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3 Badge" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript Badge" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?logo=docker&logoColor=white" alt="Docker Badge" />

  <h1>Lumina: AI Watermark Remover</h1>
  <p><em>Seamlessly extract and remove Gamma.app watermarks from your presentations and PDF documents.</em></p>
</div>

---

## 📖 Overview

**Lumina** (formerly Gamma AI Watermark Remover) is a lightweight, high-performance web application designed to automatically detect and remove Gamma.app watermarks from both PDF and PowerPoint (PPTX) files. 

By analyzing slide layouts, master templates, and PDF metadata, Lumina scrubs out hard-coded watermarks, hyperlinks, and images without corrupting the original formatting or layout of your documents. 

##  Key Features

- **Multi-format Support**: Processes both `.pdf` and `.pptx` documents cleanly.
- **Smart Detection Engine**: Intelligently parses PPTX slide masters and PDF bounding boxes to target specific Gamma hyperlinked watermarks without touching user content.
- **Premium Dark UI**: A gorgeous, glassmorphic UI built natively with vanilla CSS (no heavy frameworks).
- **Global Drag-and-Drop**: Drop files anywhere on the browser window to securely funnel them into the processor.
- **Auto-Cleanup**: A built-in FastAPI Background Task ensures the server stays clean by automatically purging processed files older than 60 minutes.
- **Docker Ready**: Completely containerized for instant deployment to cloud providers.



##  Project Structure

Lumina follows standard modern FastAPI architectural practices for clear separation of concerns:

```text
lumina/
├── app.py                   # Main FastAPI application & routing logic
├── requirements.txt         # Python package dependencies
├── Dockerfile               # Production container definition
├── docker-compose.yml       # Docker orchestration with mounted volumes
│
├── processors/              # Core Watermark Removal Engines
│   ├── pdf/
│   │   ├── detector.py      # PDF bounding-box watermark discovery
│   │   └── remover.py       # PDF element deletion logic
│   └── pptx/
│       ├── detector.py      # PPTX XML Layout/Master parsing
│       └── remover.py       # PPTX shape and hyperlink deletion
│
├── static/                  # Client-side Static Resources
│   ├── css/
│   │   ├── styles.css       # Core App Styles (Dark Neon theme)
│   │   └── landing.css      # Landing Page specifics
│   └── js/
│       ├── app.js           # Drag/drop, API fetching, & UI routing
│       └── landing.js       # Landing page interactive logic
│
├── templates/               # Server-rendered HTML Views (Jinja2)
│   ├── index.html           # Main application tool UI
│   ├── landing.html         # Marketing landing page
│   └── about.html           # Project details & logic breakdowns
│
└── utils/
    ├── file_helpers.py      # Extension formatting and MIME mapping
    └── processors.py        # Centralized processor execution controller
```

<br>

## 🚀 Getting Started

You can run Lumina either locally on your machine via Python, or instantly using Docker.

### Option 1: Run with Docker (Recommended)

The easiest way to get started without polluting your local environment. You must have Docker and Docker Compose installed.

1. Clone the repository and navigate inside:
   ```bash
   git clone https://github.com/ankush850/gamma-ai-watermark-remover.git
   cd gamma-ai-watermark-remover
   ```
2. Build and start the container:
   ```bash
   docker-compose up --build -d
   ```
3. Open your browser and go to `http://localhost:8999`

### Option 2: Run Locally (Python Environment)

If you are developing or modifying the `processors/` logic, running it locally is best.

1. Ensure you have **Python 3.9+** installed.
2. Clone the repository:
   ```bash
   cd gamma-ai-watermark-remover
   ```
3. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
4. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the underlying FastAPI server via Uvicorn:
   ```bash
   uvicorn app:app --port 8999 --reload
   ```
6. Visit `http://localhost:8999` to use the tool.

---

<p align="center">Built with ❤️ for cleaner presentations. Maintained by Ankush 850.</p>
