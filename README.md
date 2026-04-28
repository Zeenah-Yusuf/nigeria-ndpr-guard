# RegTrack — Multi-Framework Regulatory Compliance Platform

**Built by Nexus SafeSphere for the RegTech Hackathon at AI Skills Week Abuja 2026**

[Live Demo: regtrack.vercel.app](https://nigeria-ndpr-guard.vercel.app)


## About The Project

RegTrack is an AI-powered compliance platform that helps Nigerian startups and SMEs assess their regulatory compliance risk before launching their products. The platform addresses the critical solutions gap in Nigeria's regulatory ecosystem where regulations exist but accessible, affordable compliance tools do not — across NDPA, CBN AML/CFT, SEC Crowdfunding, and NITDA DP frameworks.

Our mission is simple: prevent Nigerian founders from receiving devastating fines for compliance oversights they didn't know existed — across any regulatory framework.

**Key Differentiators:**

- Built on the current NDP Act 2023 and GAID 2025 framework alongside CBN AML/CFT 2022, SEC Crowdfunding 2021, and NITDA DP Framework
- Fully multilingual with support for English, Hausa, Igbo, and Yoruba across all frameworks
- DCPMI classification for determining regulatory tier requirements
- AI-powered risk analysis with actionable remediation checklists per framework
- Semantic search across all indexed regulatory sections in four languages
- Real-time regulatory update monitoring from NDPC, CBN, SEC, and NITDA
- Obligation extractor that parses uploaded documents for compliance requirements
- Regulator dashboard (SupTech) for compliance posture monitoring


## The Problem

A Nigerian fintech founder launches a payment platform that processes transactions for thousands of users. The product is well-built and customers love it. Then the enforcement notices arrive:

- CBN sends an AML/CFT enforcement notice — no KYC process, no transaction monitoring
- NDPC flags data protection gaps — no privacy policy, no consent mechanism, no DPO
- SEC queries crowdfunding registration — operating without required portal license

Three regulators. Three deadlines. Potential fines exceeding fifteen million naira. The founder didn't act maliciously. She simply didn't know that running a payment platform triggers obligations under multiple regulatory frameworks simultaneously.

This scenario plays out every month across Lagos, Abuja, and Port Harcourt.

The statistics tell a stark story:

- Eighty percent of early-stage Nigerian startups cannot afford a dedicated compliance officer which costs over three hundred thousand naira monthly
- Seventy-two percent of founders have never read the NDP Act or any other regulatory framework
- Ninety-four percent would use a free compliance checker if one existed
- The maximum penalty for non-compliance is two percent of annual gross revenue or ten million naira for NDPA violations plus daily fines for CBN infractions
- Most startups are subject to two or more regulatory frameworks but have no tool to assess them simultaneously

Nigeria does not have a compliance problem. It has a solutions gap. RegTrack exists to close that gap across all applicable frameworks.


## Our Solution

RegTrack provides a three-step flow designed specifically for Nigerian founders facing multi-framework regulatory requirements:

**Step One: Scan**

Answer questions about your product. The assessment takes under two minutes to complete. No legal knowledge required. The scanner automatically detects which frameworks apply to your business based on your sector, automatically determines DCPMI classification, and presents framework-specific questions covering NDPA, CBN AML, SEC, and NITDA requirements.

**Step Two: Analyze**

Our AI evaluates your responses against the full NDP Act 2023, CBN AML/CFT Regulations 2022, SEC Crowdfunding Rules 2021, and NITDA DP Framework. You receive an instant risk score from zero to one hundred per framework, a list of triggered regulatory sections across all applicable frameworks, and a plain English explanation of what everything means.

**Step Three: Fix**

We do not just diagnose problems. We prescribe the cure. You receive a personalized remediation checklist with step-by-step guidance and direct links to official resources from NDPC, CBN, SEC, and NITDA. Each item includes difficulty level, estimated time to complete, and framework-specific evidence requirements.


## Frameworks Covered

| Framework | Regulator | Effective Date | Key Requirements |
|-----------|-----------|---------------|-----------------|
| NDP Act 2023 | NDPC | June 12, 2023 | Privacy policy, consent mechanism, DPO appointment, breach notification (72hrs), DCPMI registration, annual CAR filing |
| CBN AML/CFT 2022 | CBN | September 1, 2022 | KYC/CDD, transaction monitoring, STR filing (24hrs), PEP screening, AML compliance officer, annual risk assessment |
| SEC Crowdfunding 2021 | SEC | January 1, 2021 | Portal registration, ₦100M minimum capital, investor protection, 48hr cooling-off, due diligence on issuers |
| NITDA DP Framework | NITDA | November 1, 2020 | DPO appointment (1000+ subjects), annual DPIA, privacy policy, data inventory, breach notification (72hrs) |


## Core Features

**Multi-Framework Risk Scanner**

A comprehensive interactive assessment that analyzes your product's data practices against the NDP Act 2023, CBN AML/CFT 2022, SEC Crowdfunding 2021, and NITDA DP Framework. The AI returns an instant risk score with color-coded severity levels per framework and identifies which specific sections apply to your situation. The scanner automatically determines your DCPMI tier and applicable frameworks based on sector and data volume.

**Multi-Framework Clause Finder**

A semantic search engine across all indexed regulatory sections in four languages. Type keywords like "consent", "KYC", or "breach notification" and instantly find the exact regulatory references with plain English summaries across NDPA, CBN, SEC, and NITDA frameworks. Powered by vector embeddings for accurate, context-aware search.

**AI Obligation Extractor**

Upload any policy document, terms of service, or privacy policy. Our AI extracts regulatory obligations automatically across all frameworks. Supports PDF, DOCX, and TXT files. Returns structured obligations with section references, compliance status indicators, and confidence scores.

**Multilingual Support**

RegTrack speaks your language. Full support for English, Hausa, Igbo, and Yoruba. The entire interface, scanner questions, results, clause finder, and remediation checklists are available in all four languages. This aligns with NDPC's partnership with Meta to translate the NDP Act into major Nigerian languages.

**Plain English Explanations**

No legal jargon. Every result includes a clear summary written in language founders actually understand. We translate complex regulatory text from multiple frameworks into actionable insights.

**Personalized Remediation Checklist**

After analysis you receive a customized checklist organized by priority and framework. Critical items appear first followed by high priority, medium priority, and low priority tasks. Each item includes the specific action needed, difficulty level, estimated completion time, framework reference, evidence requirements, and direct links to official resources. You can check off items as you complete them and your progress saves automatically. Completing items reduces your risk score in real-time.

**Evidence Upload with Smart Requirements**

When uploading compliance evidence, the platform automatically detects what type of document is required based on the clause. Privacy policies require PDF/DOCX uploads. Registration certificates accept PDF/JPEG/PNG. KYC documentation requires specific formats. Each upload includes framework-specific guidance and accepted document examples.

**Regulatory Update Monitoring**

RegTrack continuously monitors NDPC, CBN, SEC, and NITDA for regulatory updates via web scraping and RSS feeds. New regulations are detected within hours and flagged to affected users based on their sector and compliance profile. The regulation update banner shows real-time impact on your compliance status.

**Regulator Dashboard (SupTech)**

A dedicated dashboard demonstrating how regulators (NDPC, CBN, SEC, NITDA) could monitor compliance posture across all regulated entities in real-time. Features sector heatmaps, framework breakdowns, recent scan logs, and machine-readable OSCAL export for regulator consumption.

**PDF Report Export**

Download a professional multi-framework compliance assessment report with one click. The report includes your risk scores per framework, DCPMI classification, all triggered sections, your answers to each question, the remediation checklist, framework-specific resources, and an executive summary. Share it with your team, investors, or compliance officers.

**DCPMI Classification**

Automatic determination of your Data Controller or Processor of Major Importance tier based on your sector, data volume, and processing activities. Receive tier-specific compliance requirements for Ultra-High Level, Extra-High Level, and Ordinary-High Level classifications with corresponding registration fees.

**Progress Tracking**

Your checklist progress persists in your browser so you can return later and continue where you left off. Mark items complete as you implement fixes and watch your compliance progress bar fill up across all frameworks.


## Technical Architecture

RegTrack was built using a modern, serverless stack optimized for the hackathon and designed for scalability.

**Frontend Layer**

The user interface is built with React 18 and TypeScript for type safety and maintainability. Vite provides fast builds and hot module replacement during development. Tailwind CSS with shadcn UI components handles styling with a consistent design system. The application is deployed and hosted on Vercel.

**Backend and Database Layer**

Supabase serves as the integrated backend platform. It provides the PostgreSQL database with pgvector extension for semantic search capabilities. Supabase Edge Functions power the serverless API endpoints for risk assessment, clause search, report generation, document parsing, regulator monitoring, and alert generation. Real-time subscriptions enable live regulatory update notifications.

**AI and Machine Learning**

OpenAI API provides two critical capabilities. GPT-4o-mini analyzes user responses and generates risk assessments with structured JSON output across all regulatory frameworks. Text embedding 3 small converts search queries and clause content into 1536 dimensional vectors enabling semantic similarity search across the regulation text in all four languages.

HuggingFace inference API provides free fallback capabilities for text summarization, zero-shot classification, and question answering when OpenAI is unavailable.

**Data Pipeline**

The NDP Act 2023, CBN AML/CFT 2022, SEC Crowdfunding Rules 2021, and NITDA DP Framework were manually extracted from official regulatory documents and structured into clauses. Each clause was structured with a unique identifier, title, full content, plain English summary, relevant keywords, affected sectors, and clause type. The Hausa, Igbo, and Yoruba translations from NDPC's official multilingual release were processed and indexed. Vector embeddings were generated for all clauses across all languages and frameworks to power semantic search.

**Monitoring Pipeline**

Supabase Edge Functions run on cron schedules to monitor regulator websites for new publications. RSS feeds and HTML scraping extract new regulatory updates. The generate-alerts function matches updates to affected users based on sector and framework, creating personalized alerts stored in the database.


## Team Nexus SafeSphere

**Zeenatudeen Zubair Yusuf — Lead Developer**

Responsible for overall project architecture, frontend development with React and TypeScript, Supabase Edge Functions implementation, multilingual integration, database schema design, and Vercel deployment pipeline. Built the core scanner interface, multi-framework support, remediation checklist features, obligation extractor, regulation update banner, and regulator dashboard.

**Innocent Ojisua — Machine Learning Engineer**

Designed the AI prompting strategy for accurate multi-framework regulatory analysis. Implemented the OpenAI integration including chat completion for risk assessment and embeddings generation for semantic search. Created the clause chunking and indexing pipeline across all four frameworks and languages. Built the HuggingFace fallback integration.

**Precious Kulutuye — Product and Compliance Research**

Led the extraction and structuring of NDP Act 2023, CBN AML/CFT 2022, SEC Crowdfunding Rules 2021, and NITDA DP Framework content from official regulatory documents. Validated all AI-generated responses against regulatory text. Designed the user journey, remediation checklist mapping, and evidence requirements matrix. Created the pitch deck and documentation.


## Built With

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- shadcn/ui component library
- Supabase for database, vector search, Edge Functions, and real-time subscriptions
- PostgreSQL with pgvector extension
- OpenAI API (GPT-4o-mini and text-embedding-3-small)
- HuggingFace inference API for free NLP fallback
- Vercel for frontend hosting and deployment


## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or bun package manager
- Supabase account for backend services
- OpenAI API account with API key
- HuggingFace account with API key (optional, for free fallback features)

### Installation

First clone the repository to your local machine:

git clone https://github.com/Zeenah-Yusuf/nigeria-ndpr-guard.git
Navigate into the project directory:

cd nigeria-ndpr-guard
Install dependencies:

npm install
# or
bun install
Create a .env.local file in the root directory:

cp .env.example .env.local
Add your environment variables to .env.local:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_FUNCTION_URL=your_supabase_functions_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
HF_API_KEY=your_huggingface_api_key
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=RegTrack
VITE_APP_ENV=development
Run database migrations and seed data:

bash
npm run setup:all
# This runs: db:migrate → db:seed → embeddings:generate
Start the development server:

npm run dev
# or
bun run dev
Open your browser and navigate to http://localhost:5173 to view the application.

Deployment
The application is deployed through Vercel. Any changes pushed to the main branch automatically trigger a new deployment.

To deploy Edge Functions:

npm run functions:deploy
# Deploys all functions: scan, search, generate-report, parse-document, monitor-regulators, generate-alerts
Available Scripts
Script	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build
npm run setup:all	Run migrations, seed data, generate embeddings
npm run setup:db	Run only database setup
npm run setup:embeddings	Generate embeddings only
npm run functions:deploy	Deploy all Edge Functions
npm run lint	Run ESLint
npm run type-check	Run TypeScript type checking
npm test	Run tests
Project Structure
nigeria-ndpr-guard/
├── public/                    # Static assets (favicon, robots.txt, images)
├── src/
│   ├── assets/               # Images and static files
│   ├── components/
│   │   ├── layout/           # Layout components (LanguageSelector)
│   │   └── ui/               # UI components
│   │       ├── ClauseFinder.tsx
│   │       ├── ComplianceGapSection.tsx
│   │       ├── DemoSection.tsx
│   │       ├── EvidenceUploadModal.tsx
│   │       ├── Footer.tsx
│   │       ├── HeroSection.tsx
│   │       ├── Navbar.tsx
│   │       ├── ObligationExtractor.tsx
│   │       ├── QuestionModal.tsx
│   │       ├── RegulationUpdateBanner.tsx
│   │       ├── RemediationChecklist.tsx
│   │       ├── ResourcesSidebar.tsx
│   │       ├── RiskResults.tsx
│   │       ├── RiskScanner.tsx
│   │       ├── SectorSelector.tsx
│   │       ├── SolutionSection.tsx
│   │       ├── TrustBadges.tsx
│   │       └── WaitlistSection.tsx
│   ├── contexts/             # React context providers
│   │   └── LanguageContext.tsx
│   ├── data/                 # Framework datasets
│   │   ├── cbn_dataset.json
│   │   ├── ndpa_dataset.json
│   │   ├── sec_dataset.json
│   │   └── nitda_dataset.json
│   ├── hooks/                # Custom React hooks
│   │   ├── useRegulatorData.tsx
│   │   ├── UseClauseSearch.ts
│   │   ├── UseRiskScanner.ts
│   │   ├── Uselanguage.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                  # Utilities and services
│   │   ├── frameworks/       # Policy-as-code framework files
│   │   │   ├── cbn-aml.json
│   │   │   └── ndpa-obligations.json
│   │   ├── constants.ts
│   │   ├── generateReport.ts
│   │   ├── RegulatorDataService.tsx
│   │   ├── regulatory-updates.json
│   │   ├── remediationData.ts
│   │   ├── sectorRecommendations.ts
│   │   ├── SupabaseClient.ts
│   │   └── utils.ts
│   ├── pages/                # Page components
│   │   ├── About.tsx
│   │   ├── ComplianceGap.tsx
│   │   ├── Demo.tsx
│   │   ├── Home.tsx
│   │   ├── NotFound.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── Regulator.tsx
│   │   ├── solution.tsx
│   │   └── TermsOfService.tsx
│   ├── translations/         # Multilingual support
│   │   ├── en.json           # English
│   │   ├── ha.json           # Hausa
│   │   ├── ig.json           # Igbo
│   │   └── yo.json           # Yoruba
│   └── types/                # TypeScript type definitions
│       └── index.ts
├── supabase/
│   ├── functions/            # Edge Functions
│   │   ├── generate-alerts/
│   │   ├── generate-report/
│   │   ├── monitor-regulators/
│   │   ├── parse-document/
│   │   ├── scan/
│   │   ├── search/
│   │   └── shared/           # Shared utilities
│   │       ├── ai-service.ts
│   │       ├── cors.ts
│   │       ├── huggingface-client.ts
│   │       ├── openai-client.ts
│   │       └── types.ts
│   ├── migrations/           # Database migrations
│   │   ├── 20240401000000_enable_pgvector.sql
│   │   ├── 20240601000000_multi_regulator_core.sql
│   │   ├── 20240601000001_regulations_clauses.sql
│   │   ├── 20240601000002_monitoring_alerts.sql
│   │   ├── 20240601000003_search_functions.sql
│   │   └── 20240601000004_seed_frameworks.sql
│   └── seed/                 # Seed data
│       └── seed.sql
├── scripts/                  # Utility scripts
│   ├── deploy.sh
│   ├── generate-embeddings.js
│   └── migrate-existing-data.js
├── .env.example
├── .env.local                # (gitignored)
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
Roadmap
Completed During Hackathon
NDP Act 2023 and GAID 2025 compliance framework integration

CBN AML/CFT Regulations 2022 framework integration

SEC Crowdfunding Rules 2021 framework integration

NITDA Data Protection Framework integration

Multi-framework risk scanner with DCPMI tier detection

Clause finder with semantic search across all indexed regulatory sections

Full multilingual support for English, Hausa, Igbo, and Yoruba across all frameworks

AI-powered plain English explanations in all four languages

Personalized remediation checklist with priority levels and official resource links

AI obligation extractor with document parsing capabilities

Real-time regulatory update monitoring from NDPC, CBN, SEC, and NITDA

Evidence upload with smart document requirement detection

PDF export functionality for assessment reports

Progress tracking with browser persistence

Regulator dashboard with SupTech demo

Mobile responsive design with Nigerian branding

Supabase Edge Functions for serverless backend

Vector embeddings for semantic search across all frameworks

HuggingFace fallback for free NLP capabilities

OSCAL export for machine-readable compliance data

Q3 2026 Planned Features
Real-time compliance monitoring for registered products

Automated CAR filing reminders and deadline tracking

Team collaboration with multi-user workspaces

DPO dashboard for compliance officers

Email and SMS notifications for regulatory updates

NAFDAC healthtech regulations module

NAICOM insurance regulations module

Q4 2026 Planned Features
Public API for developers and partners

White label solution for DPCO organizations

Integration with BVN/NIN verification services

Automated KYC/AML compliance reporting

Cross-border data transfer impact assessment tool

Enterprise SSO and audit logging

Acknowledgments
This project was built for the RegTech Hackathon at AI Skills Week Abuja 2026 organized by Data Science Nigeria and Microsoft.

Special thanks to:

The Nigeria Data Protection Commission for making the NDP Act 2023 and GAID 2025 framework publicly accessible

The Central Bank of Nigeria for publishing the AML/CFT Regulations 2022

The Securities and Exchange Commission Nigeria for the Crowdfunding Rules 2021

The National Information Technology Development Agency for the DP Framework

The NDPC and Meta partnership for providing official Hausa, Igbo, and Yoruba translations of the NDP Act

The OpenAI team for providing API access

The HuggingFace team for free inference API access

The Supabase team for their excellent developer platform

The Vercel team for seamless deployment

All the Nigerian founders who shared their compliance struggles and validated the need for this solution

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
Nexus SafeSphere

Live Demo: regtrack.vercel.app

GitHub: github.com/Zeenah-Yusuf/nigeria-ndpr-guard

Email: yusufzeenah12@gmail.com

Built for Naija with love in Lagos and Abuja 🇳🇬

RegTrack — Bridging the gap between Nigerian innovation and regulation across all frameworks.