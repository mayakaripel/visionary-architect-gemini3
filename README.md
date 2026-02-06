<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1sQb1jY5b50ouMYt6hG3Jv9JCsp5aGlGy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

🏗️ Visionary Architect
Multimodal Agentic Intelligence for Urban Safety & Disaster Response
Visionary Architect is an AI-powered safety intelligence system designed for urban planners and emergency responders. By leveraging the Gemini 3 reasoning engine, it transforms raw drone imagery and video into actionable, evidence-based disaster mitigation plans.

🌪️ The Problem
During disasters (floods, earthquakes, structural failures), responders are often "data rich but insight poor." They have hours of drone footage but lack the time to manually inspect every frame for structural integrity or access constraints.

🛡️ The Solution
Visionary Architect uses a multi-agent reasoning pipeline to:

See: Detect visible hazards using adaptive high-fidelity visual processing.

Reason: Assess risk levels using conservative, safety-first logic.

Act: Generate structured response plans for GIS and emergency dashboards.

🧠 Technical Architecture: The Gemini 3 Reasoning Engine
The system departs from linear prompting, utilizing an agentic workflow where specialized agents share context to reach a unified conclusion.

🔹 1. Adaptive Multimodal Processing
Instead of processing entire video files at max resolution (which is compute-heavy), the system uses an Adaptive Visual Strategy:

Layer 1: Low-resolution scan to identify "Regions of Interest" (ROI).

Layer 2: High-fidelity re-analysis of detected cracks, debris, or structural anomalies.

🔹 2. The Multi-Agent Loop

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| **Visual Analysis** | Perception | Extracts spatial layout and identifies visible hazards. |
| **Risk & Integrity** | Judgment | Evaluates severity (Low/Med/High) using evidence-based constraints. |
| **Planning & Logistics** | Strategy | Creates prioritized mitigation steps (e.g., "Clear Route Alpha"). |


🔹 3. Safety-First Constraints
To ensure reliability in critical scenarios, the engine is governed by Grounded Reasoning:

No Speculation: If a hazard isn't visible, it isn't reported.

Evidence Linking: Every finding is linked to specific video timestamps or image coordinates.

Structured Output: Generates strictly validated JSON for integration with GIS platforms.



Getting Started

Prerequisites
Python 3.10+

Google Cloud Vertex AI API Key (Gemini 3 Flash access)

FFmpeg (for video frame processing)

Installation
Bash
git clone https://github.com/your-username/visionary-architect.git
cd visionary-architect
pip install -r requirements.md

Usage
Python
from visionary_architect import SafetyEngine

# Initialize the engine with Gemini 3
engine = SafetyEngine(api_key="YOUR_API_KEY")

# Analyze drone footage
report = engine.analyze_site("drone_survey_01.mp4")

print(report.summary())
# Output: [HIGH RISK] Structural compromise detected at Section B. 
# Mitigation: Immediate evacuation of 50m radius recommended.

Built With
Model: Gemini 3 Flash (Multimodal Reasoning)

Orchestration: LangGraph / LangChain

Processing: OpenCV & Pydantic (Structured Data)

Frontend: Next.js (Incident Dashboard)

Database: Pinecone (Vectorized Safety Protocols)

Roadmap

[ ] Temporal Analysis: Tracking structural decay across multiple video sessions.

[ ] Live Stream Integration: Direct processing of RTSP drone feeds.

[ ] Offline Edge Deployment: Lightweight model versions for field use.

Contributing
We welcome contributions from structural engineers, GIS specialists, and AI researchers. Please see CONTRIBUTING.md for details.

License
This project is licensed under the MIT License - see the LICENSE file for details.
