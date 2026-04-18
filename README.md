# RegTrack — NDPR Compliance Simulator

**Built by Nexus SafeSphere for the RegTech Hackathon at AI Skills Week Abuja 2026**

[Live Demo: nigeria-ndpr-guard.lovable.app](https://nigeria-ndpr-guard.lovable.app)


## About The Project

RegTrack is an AI-powered compliance simulator that helps Nigerian startups and SMEs assess their NDPR (Nigeria Data Protection Regulation) compliance risk before launching their products. The platform addresses the critical solutions gap in Nigeria's regulatory ecosystem where regulations exist but accessible, affordable compliance tools do not.

Our mission is simple: prevent Nigerian founders from receiving devastating fines for compliance oversights they didn't know existed.


## The Problem

A Lagos founder builds a healthtech app that collects patient symptoms. Users love it and five thousand people sign up in the first week. Two weeks after launch, NITDA sends an enforcement notice. The fine is ten million naira. The violation is simple: no privacy policy and no consent mechanism.

This scenario plays out every month across Lagos, Abuja, and Port Harcourt.

The statistics tell a stark story:

- Eighty percent of early-stage Nigerian startups cannot afford a dedicated compliance officer which costs over three hundred thousand naira monthly
- Seventy-two percent of founders have never read the NDPR Implementation Framework
- Ninety-four percent would use a free compliance checker if one existed
- The maximum penalty for non-compliance is two percent of annual gross revenue or ten million naira whichever is greater

Nigeria does not have a compliance problem. It has a solutions gap. RegTrack exists to close that gap.


## Our Solution

RegTrack provides a three-step flow designed specifically for Nigerian founders:

**Step One: Scan**

Answer eight simple yes or no questions about your product. The assessment takes under two minutes to complete. No legal knowledge required.

**Step Two: Analyze**

Our AI evaluates your responses against the full NDPR Implementation Framework. You receive an instant risk score from zero to one hundred along with a list of triggered NDPR clauses and a plain English explanation of what everything means.

**Step Three: Fix**

We do not just diagnose problems. We prescribe the cure. You receive a personalized remediation checklist with step-by-step guidance and direct links to official NITDA resources. Each item includes difficulty level and estimated time to complete.


## Core Features

**NDPR Risk Scanner**

An eight-question interactive assessment that analyzes your product's data practices against the NDPR Implementation Framework. The AI returns an instant risk score with color-coded severity levels and identifies which specific clauses apply to your situation.

**Plain English Explanations**

No legal jargon. Every result includes a clear summary written in language founders actually understand. We translate complex regulatory text into actionable insights.

**Personalized Remediation Checklist**

After analysis you receive a customized checklist organized by priority. Critical items appear first followed by high priority and medium priority tasks. Each item includes the specific action needed, difficulty level, estimated completion time, and direct links to official templates and resources. You can check off items as you complete them and your progress saves automatically.

**Clause Finder**

A semantic search engine across sixteen plus indexed NDPR clauses. Type keywords like health data or breach notification and instantly find the exact regulatory references with plain English summaries. Perfect for deeper research or validating specific compliance questions.

**PDF Export**

Download a professional compliance assessment report with one click. The report includes your risk score, all triggered clauses, your answers to each question, the remediation checklist, and recommended resources. Share it with your team, investors, or compliance officers.

**Progress Tracking**

Your checklist progress persists in your browser so you can return later and continue where you left off. Mark items complete as you implement fixes and watch your compliance progress bar fill up.


## Technical Architecture

RegTrack was built in forty-eight hours using a modern stack aligned with the hackathon's Microsoft sponsorship requirements.

**Frontend Layer**

The user interface is built with React eighteen and TypeScript for type safety and maintainability. Vite provides fast builds and hot module replacement during development. Tailwind CSS handles styling with a consistent design system. The application is deployed and hosted on Lovable.

**Backend and Database Layer**

Lovable Cloud serves as the integrated backend and hosting platform. It manages the application deployment, environment configuration, and serverless functions that power the risk assessment and clause search endpoints. The NDPR clause data is structured and served through Lovable's managed infrastructure.

**AI and Machine Learning**

Azure OpenAI Service provides two critical capabilities. GPT-four-o-mini analyzes user responses and generates risk assessments with structured JSON output. Text embedding three small converts search queries and clause content into fifteen thirty-six dimensional vectors enabling semantic similarity search across the regulation text.

**Data Pipeline**

The NDPR Implementation Framework was manually extracted from the official PDF and chunked into nineteen core clauses. Each clause was structured with a unique identifier, title, full content, plain English summary, and relevant keywords. This structured data powers both the risk scanner and the clause finder.


## Team Nexus SafeSphere

**Zeenatudeen Zubair Yusuf — Lead Developer**

Responsible for overall project architecture, frontend development with React and TypeScript, Lovable Cloud integration, and deployment pipeline. Built the core scanner interface and remediation checklist features.

**Innocent Ojisua — Machine Learning Engineer**

Designed the AI prompting strategy for accurate NDPR analysis. Implemented the Azure OpenAI integration including chat completion for risk assessment and embeddings generation for semantic search. Created the clause chunking and indexing pipeline.

**Precious Kulutuye — Product and Compliance Research**

Led the extraction and structuring of NDPR content from the official Implementation Framework. Validated all AI-generated responses against regulatory text. Designed the user journey and remediation checklist mapping. Created the pitch deck and documentation.


## Built With

- React version eighteen
- TypeScript version five
- Vite version five
- Tailwind CSS version three
- shadcn UI component library
- Lovable Cloud for backend services and hosting
- Azure OpenAI Service including GPT-four-o-mini and text embedding three small
- Lovable for rapid prototyping and deployment


## Getting Started

**Prerequisites**

- Node.js version eighteen or higher
- npm or bun package manager
- Lovable account for project management
- Azure OpenAI account with deployed models

**Installation**

First clone the repository to your local machine using git clone followed by the repository URL.

Navigate into the project directory using cd nigeria-ndpr-guard.

Install dependencies using npm install or bun install.

Create a dot env file in the root directory and add your environment variables for Azure OpenAI endpoint and Azure OpenAI key.

Start the development server using npm run dev or bun run dev.

Open your browser and navigate to localhost port three thousand to view the application.

**Environment Variables**

The following environment variables are required. Create a dot env file in the project root.

- VITE underscore AZURE underscore OPENAI underscore ENDPOINT equals your Azure OpenAI endpoint URL
- VITE underscore AZURE underscore OPENAI underscore KEY equals your Azure OpenAI API key
- VITE underscore AZURE underscore OPENAI underscore DEPLOYMENT equals gpt-four-o-mini

**Deployment**

The application is deployed through Lovable Cloud. Any changes pushed to the main branch automatically trigger a new deployment. The live site is available at nigeria dash ndpr dash guard dot lovable dot app.


## Project Structure

The repository is organized as follows:

- The public directory contains static assets including favicon and Open Graph images
- The source directory contains all application code
- Within source the components directory holds React components organized by feature including layout components, scanner components, search components, and shared UI components
- The hooks directory contains custom React hooks for risk scanning and clause search functionality
- The lib directory includes utility functions and service integrations
- The types directory holds TypeScript interface definitions
- The pages directory contains the main page components for Home, Search, and About routes
- The styles directory includes global CSS and Tailwind configuration
- Configuration files at the root include package dot json, tsconfig dot json, vite dot config dot ts, and tailwind dot config dot ts


## Roadmap

**Completed During Hackathon**

- NDPR risk scanner with eight question assessment
- Clause finder with semantic search across sixteen plus indexed clauses
- AI-powered plain English explanations
- Personalized remediation checklist with priority levels
- PDF export functionality for assessment reports
- Progress tracking with browser persistence
- Mobile responsive design
- Nigerian specific branding and localization

**Q3 2026 Planned Features**

- Real-time compliance monitoring for registered products
- Automated audit report generator in NITDA Annexure A format
- Team collaboration with multi-user workspaces
- DPO dashboard for compliance officers
- Email notifications for regulatory updates

**Q4 2026 Planned Features**

- CBN fintech guidelines integration
- NAFDAC healthtech regulations module
- SEC investment crowdfunding compliance checks
- Public API for developers and partners
- White label solution for DPCO organizations


## Acknowledgments

This project was built for the RegTech Hackathon at AI Skills Week Abuja 2026 organized by Data Science Nigeria and Microsoft.

Special thanks to:

- The National Information Technology Development Agency for making the NDPR Implementation Framework publicly accessible
- The Azure OpenAI team for providing hackathon participants with API credits
- The Lovable team for enabling rapid frontend prototyping and backend deployment
- All the Nigerian founders who shared their compliance struggles and validated the need for this solution


## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Contact

**Nexus SafeSphere**

- Live Demo: nigeria dash ndpr dash guard dot lovable dot app
- GitHub: github dot com slash Zeenah dash Yusuf slash nigeria dash ndpr dash guard
- Built for Naija with love in Lagos

RegTrack — Bridging the gap between Nigerian innovation and regulation.
