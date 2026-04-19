# RegTrack — NDP Act Compliance Simulator

**Built by Nexus SafeSphere for the RegTech Hackathon at AI Skills Week Abuja 2026**

[Live Demo: regtrack.vercel.app](https://regtrack.vercel.app)


## About The Project

RegTrack is an AI-powered compliance simulator that helps Nigerian startups and SMEs assess their NDP Act (Nigeria Data Protection Act 2023) and GAID 2025 compliance risk before launching their products. The platform addresses the critical solutions gap in Nigeria's regulatory ecosystem where regulations exist but accessible, affordable compliance tools do not.

Our mission is simple: prevent Nigerian founders from receiving devastating fines for compliance oversights they didn't know existed.

**Key Differentiators:**

- Built on the current NDP Act 2023 and GAID 2025 framework, not outdated NDPR 2019
- Fully multilingual with support for English, Hausa, Igbo, and Yoruba
- DCPMI classification for determining regulatory tier requirements
- AI-powered risk analysis with actionable remediation checklists
- Semantic search across all indexed NDP Act sections in four languages


## The Problem

A Nigerian founder launches a healthtech app that collects patient symptoms. Users love it and five thousand people sign up in the first week. Two weeks after launch, NDPC sends an enforcement notice. The fine is ten million naira. The violation is simple: no privacy policy and no consent mechanism.

This scenario plays out every month across Lagos, Abuja, and Port Harcourt.

The statistics tell a stark story:

- Eighty percent of early-stage Nigerian startups cannot afford a dedicated compliance officer which costs over three hundred thousand naira monthly
- Seventy-two percent of founders have never read the NDP Act or GAID 2025 framework
- Ninety-four percent would use a free compliance checker if one existed
- The maximum penalty for non-compliance is two percent of annual gross revenue or ten million naira whichever is greater

Nigeria does not have a compliance problem. It has a solutions gap. RegTrack exists to close that gap.


## Our Solution

RegTrack provides a three-step flow designed specifically for Nigerian founders:

**Step One: Scan**

Answer questions about your product. The assessment takes under two minutes to complete. No legal knowledge required. The scanner automatically detects DCPMI classification based on your sector and data processing activities.

**Step Two: Analyze**

Our AI evaluates your responses against the full NDP Act 2023 and GAID 2025 framework. You receive an instant risk score from zero to one hundred along with a list of triggered NDP Act sections and a plain English explanation of what everything means.

**Step Three: Fix**

We do not just diagnose problems. We prescribe the cure. You receive a personalized remediation checklist with step-by-step guidance and direct links to official NDPC resources. Each item includes difficulty level and estimated time to complete.


## Core Features

**NDP Act Risk Scanner**

A comprehensive interactive assessment that analyzes your product's data practices against the NDP Act 2023 and GAID 2025 framework. The AI returns an instant risk score with color-coded severity levels and identifies which specific sections apply to your situation. The scanner automatically determines your DCPMI tier based on sector and data volume.

**Multilingual Support**

RegTrack speaks your language. Full support for English, Hausa, Igbo, and Yoruba. The entire interface, scanner questions, results, and clause finder are available in all four languages. This aligns with NDPC's partnership with Meta to translate the NDP Act into major Nigerian languages.

**Plain English Explanations**

No legal jargon. Every result includes a clear summary written in language founders actually understand. We translate complex regulatory text into actionable insights.

**Personalized Remediation Checklist**

After analysis you receive a customized checklist organized by priority. Critical items appear first followed by high priority and medium priority tasks. Each item includes the specific action needed, difficulty level, estimated completion time, and direct links to official NDPC templates and resources. You can check off items as you complete them and your progress saves automatically.

**Clause Finder with Semantic Search**

A semantic search engine across all indexed NDP Act and GAID 2025 sections in four languages. Type keywords like consent or breach notification and instantly find the exact regulatory references with plain English summaries. Powered by vector embeddings for accurate, context-aware search.

**DCPMI Classification**

Automatic determination of your Data Controller or Processor of Major Importance tier based on your sector, data volume, and processing activities. Receive tier-specific compliance requirements for Ultra-High Level, Extra-High Level, and Ordinary-High Level classifications.

**PDF Export**

Download a professional compliance assessment report with one click. The report includes your risk score, DCPMI classification, all triggered sections, your answers to each question, the remediation checklist, and recommended NDPC resources. Share it with your team, investors, or compliance officers.

**Progress Tracking**

Your checklist progress persists in your browser so you can return later and continue where you left off. Mark items complete as you implement fixes and watch your compliance progress bar fill up.


## Technical Architecture

RegTrack was built using a modern, serverless stack optimized for the hackathon.

**Frontend Layer**

The user interface is built with React eighteen and TypeScript for type safety and maintainability. Vite provides fast builds and hot module replacement during development. Tailwind CSS with shadcn UI components handles styling with a consistent design system. The application is deployed and hosted on Vercel.

**Backend and Database Layer**

Supabase serves as the integrated backend platform. It provides the PostgreSQL database with pgvector extension for semantic search capabilities. Supabase Edge Functions power the serverless API endpoints for risk assessment, clause search, and report generation.

**AI and Machine Learning**

OpenAI API provides two critical capabilities. GPT-four-o-mini analyzes user responses and generates risk assessments with structured JSON output. Text embedding three small converts search queries and clause content into fifteen thirty-six dimensional vectors enabling semantic similarity search across the regulation text in all four languages.

**Data Pipeline**

The NDP Act 2023 and GAID 2025 framework was manually extracted from official NDPC documents and chunked into core sections. Each section was structured with a unique identifier, title, full content, plain English summary, and relevant keywords. The Hausa, Igbo, and Yoruba translations from NDPC's official multilingual release were processed and indexed. Vector embeddings were generated for all sections across all languages to power semantic search.


## Team Nexus SafeSphere

**Zeenatudeen Zubair Yusuf — Lead Developer**

Responsible for overall project architecture, frontend development with React and TypeScript, Supabase Edge Functions implementation, multilingual integration, and Vercel deployment pipeline. Built the core scanner interface and remediation checklist features.

**Innocent Ojisua — Machine Learning Engineer**

Designed the AI prompting strategy for accurate NDP Act analysis. Implemented the OpenAI integration including chat completion for risk assessment and embeddings generation for semantic search. Created the clause chunking and indexing pipeline across all four languages.

**Precious Kulutuye — Product and Compliance Research**

Led the extraction and structuring of NDP Act and GAID 2025 content from official NDPC documents. Validated all AI-generated responses against regulatory text. Designed the user journey and remediation checklist mapping. Created the pitch deck and documentation.


## Built With

- React version eighteen
- TypeScript version five
- Vite version five
- Tailwind CSS version three
- shadcn UI component library
- Supabase for database, vector search, and Edge Functions
- PostgreSQL with pgvector extension
- OpenAI API including GPT-four-o-mini and text embedding three small
- Vercel for frontend hosting and deployment


## Getting Started

**Prerequisites**

- Node.js version eighteen or higher
- npm or bun package manager
- Supabase account for backend services
- OpenAI API account with API key

**Installation**

First clone the repository to your local machine using git clone followed by the repository URL.

Navigate into the project directory using cd nigeria-ndpr-guard.

Install dependencies using npm install or bun install.

Create a dot env local file in the root directory and add your environment variables for Supabase URL, Supabase anon key, Supabase function URL, and OpenAI API key.

Start the development server using npm run dev or bun run dev.

Open your browser and navigate to localhost port five one seven three to view the application.

**Environment Variables**

The following environment variables are required. Create a dot env local file in the project root.

- VITE underscore SUPABASE underscore URL equals your Supabase project URL
- VITE underscore SUPABASE underscore ANON underscore KEY equals your Supabase anonymous key
- VITE underscore SUPABASE underscore FUNCTION underscore URL equals your Supabase functions URL
- OPENAI underscore API underscore KEY equals your OpenAI API key

**Deployment**

The application is deployed through Vercel. Any changes pushed to the main branch automatically trigger a new deployment. The live site is available at regtrack dot vercel dot app.


## Project Structure

The repository is organized as follows:

- The public directory contains static assets including favicon and flag images
- The source directory contains all application code
- Within source the components directory holds React components organized by feature including layout components, scanner components, search components, checklist components, and shared UI components
- The contexts directory contains React context providers including LanguageContext for multilingual support
- The translations directory contains JSON files for English, Hausa, Igbo, and Yoruba translations
- The hooks directory contains custom React hooks for risk scanning, clause search, and language functionality
- The lib directory includes utility functions and Supabase client initialization
- The types directory holds TypeScript interface definitions
- The pages directory contains the main page components for Index and NotFound routes
- The supabase directory contains Edge Functions for scan, search, and report generation endpoints
- The supabase migrations directory contains SQL files for database schema setup
- Configuration files at the root include package dot json, tsconfig dot json, vite dot config dot ts, and tailwind dot config dot ts


## Roadmap

**Completed During Hackathon**

- NDP Act 2023 and GAID 2025 compliance framework integration
- Ten question risk scanner with DCPMI tier detection
- Clause finder with semantic search across all indexed NDP Act sections
- Full multilingual support for English, Hausa, Igbo, and Yoruba
- AI-powered plain English explanations in all four languages
- Personalized remediation checklist with priority levels and NDPC resource links
- PDF export functionality for assessment reports
- Progress tracking with browser persistence
- Mobile responsive design with Nigerian branding
- Supabase Edge Functions for serverless backend
- Vector embeddings for semantic search

**Q3 2026 Planned Features**

- Real-time compliance monitoring for registered products
- Automated CAR filing reminders and deadline tracking
- Team collaboration with multi-user workspaces
- DPO dashboard for compliance officers
- Email notifications for regulatory updates from NDPC

**Q4 2026 Planned Features**

- CBN fintech guidelines integration
- NAFDAC healthtech regulations module
- SEC investment crowdfunding compliance checks
- Public API for developers and partners
- White label solution for DPCO organizations


## Acknowledgments

This project was built for the RegTech Hackathon at AI Skills Week Abuja 2026 organized by Data Science Nigeria and Microsoft.

Special thanks to:

- The Nigeria Data Protection Commission for making the NDP Act 2023 and GAID 2025 framework publicly accessible
- The NDPC and Meta partnership for providing official Hausa, Igbo, and Yoruba translations of the NDP Act
- The OpenAI team for providing API access
- The Supabase team for their excellent developer platform
- The Vercel team for seamless deployment
- All the Nigerian founders who shared their compliance struggles and validated the need for this solution


## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Contact

**Nexus SafeSphere**

- Live Demo: regtrack dot vercel dot app
- GitHub: github dot com slash Zeenah dash Yusuf slash nigeria dash ndpr dash guard
- Built for Naija with love in Lagos and Abuja

RegTrack — Bridging the gap between Nigerian innovation and regulation.