export interface RolePreset {
  id: string;
  label: string;
  roleTitle: string;
  department: string;
  description: string;
  resumeText: string;
  jobDescriptionText: string;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'senior-fullstack',
    label: 'Full-Stack Engineer',
    roleTitle: 'Senior Full-Stack Software Engineer',
    department: 'Platform Engineering',
    description: 'Cloud-native TypeScript, React, Node.js, and distributed systems benchmark.',
    resumeText: `Elena Rostova
San Francisco, CA · elena.rostova@email.dev · github.com/erostova · linkedin.com/in/erostova

SUMMARY
Senior Software Engineer with 6+ years of experience building interactive web applications and backend APIs using TypeScript, React, and Node.js. Passionate about clean component architecture, developer productivity, and fast user interfaces.

EXPERIENCE
Senior Software Engineer — Veloce Cloud Systems (2023 – Present)
- Led frontend architecture migration to React 18 and TypeScript across 4 customer-facing analytics portals serving 85,000+ daily active users.
- Designed and maintained REST APIs in Node.js and Express backed by PostgreSQL and Redis caching, reducing average API response latency by 38%.
- Built shared UI component library with Tailwind CSS and Storybook, cutting new feature delivery time across 3 product squads.
- Mentored 4 junior and mid-level engineers through weekly code reviews and architecture design sessions.

Software Engineer — Horizon FinTech (2020 – 2023)
- Developed real-time transaction monitoring dashboards using JavaScript, React, and GraphQL.
- Automated deployment workflows with GitHub Actions and Docker containers on AWS EC2 and S3.
- Wrote unit and integration test suites using Jest and Vitest, increasing frontend code coverage from 52% to 88%.

EDUCATION
B.S. in Computer Science — University of Washington

SKILLS
Languages: TypeScript, JavaScript (ES6+), SQL, Python, HTML5, CSS3
Frameworks: React, Node.js, Express, GraphQL, Tailwind CSS, Jest, Vitest
Infrastructure & Data: PostgreSQL, Redis, Docker, AWS, GitHub Actions`,
    jobDescriptionText: `Senior Full-Stack Software Engineer — Core Platform
Location: San Francisco, CA / Hybrid

About the Role
We are looking for a Senior Full-Stack Software Engineer to architect and scale our next-generation enterprise workflow platform. You will partner closely with Product Management and Design to deliver resilient microservices and accessible, high-performance web applications.

Key Responsibilities
- Architect, build, and operate scalable web applications using TypeScript, React, Next.js, and Node.js.
- Design fault-tolerant microservices architecture and low-latency REST APIs and GraphQL services backed by PostgreSQL, Redis, and Kafka event streaming.
- Champion Design Systems and Accessibility (WCAG) compliance across our core enterprise dashboard using Tailwind CSS.
- Own cloud infrastructure provisioning and container orchestration using AWS, Docker, Kubernetes, and Terraform in CI/CD pipelines.
- Drive end-to-end quality with Playwright automated testing, Jest unit testing, and Datadog observability monitoring.
- Provide technical mentorship to engineers, lead system design reviews, and drive cross-functional collaboration in an Agile environment.

Required Qualifications
- 5+ years of production full-stack engineering experience with TypeScript, JavaScript, React, and Node.js.
- Strong proficiency in SQL (PostgreSQL), Redis caching, and distributed system design.
- Hands-on experience deploying containerized services with Docker, Kubernetes, and Terraform on AWS.
- Experience with Next.js, Playwright E2E testing, and WCAG accessibility standards.`,
  },
  {
    id: 'staff-ai-data',
    label: 'ML & GenAI Engineer',
    roleTitle: 'Staff Machine Learning Engineer (GenAI)',
    department: 'Applied AI Research',
    description: 'Python, PyTorch, LLM/RAG pipelines, GCP, and MLOps infrastructure benchmark.',
    resumeText: `Marcus Vance
Seattle, WA · marcus.vance@mlstudio.io · linkedin.com/in/marcusvance

PROFESSIONAL SUMMARY
Machine Learning Engineer with 5 years of experience developing predictive models, NLP pipelines, and data engineering workflows in Python. Proven ability to translate complex datasets into production inference services.

EXPERIENCE
Machine Learning Engineer — Strata Insights (2022 – Present)
- Built and trained deep learning text classification and ranking models in PyTorch and Scikit-Learn, improving recommendation precision by 24% across 2M monthly users.
- Engineered scalable ETL data pipelines using Python, Pandas, NumPy, and SQL on Snowflake to process 400GB+ of daily event telemetry.
- Deployed model inference endpoints using FastAPI and Docker containers with automated GitHub Actions CI/CD workflows.
- Partnered with product managers to design and analyze A/B testing experiments for search relevance algorithms.

Data Scientist — Apex Retail Analytics (2019 – 2022)
- Developed demand forecasting and churn prediction models using Scikit-Learn, XGBoost, and Python.
- Created executive KPI dashboards and SQL analytical queries to track cohort retention.

EDUCATION
M.S. in Data Science — Georgia Institute of Technology

SKILLS
Programming: Python, SQL, Bash
Machine Learning: PyTorch, Scikit-Learn, Pandas, NumPy, NLP, Feature Engineering
Data & Cloud: Snowflake, FastAPI, Docker, AWS, GitHub Actions`,
    jobDescriptionText: `Staff Machine Learning Engineer (GenAI & Retrieval Systems)

Role Overview
Join our Applied AI team to build production-grade Large Language Model (LLM) agents, Retrieval-Augmented Generation (RAG) pipelines, and low-latency inference infrastructure on Google Cloud (GCP).

What You Will Do
- Design, fine-tune, and evaluate LLM & Generative AI systems, embeddings, and vector database retrieval pipelines using Python and PyTorch.
- Build high-throughput inference microservices with FastAPI, gRPC, Docker, and Kubernetes on Google Cloud (GCP) and Vertex AI.
- Architect resilient ETL & Data Pipelines using SQL, Snowflake, and Apache Spark for model training datasets.
- Lead A/B testing & experimentation frameworks and partner with cross-functional stakeholders to align model metrics with product KPIs.
- Establish production observability & monitoring with Prometheus and Grafana, and mentor junior ML engineers through rigorous code reviews.

Requirements
- Strong expertise in Python, PyTorch, Scikit-Learn, Pandas, and SQL.
- Direct production experience with LLM & Generative AI (RAG, prompt engineering, embeddings).
- Experience orchestrating containerized ML workloads with Docker, Kubernetes, and Terraform on GCP or AWS.
- Track record of technical mentorship and cross-functional collaboration.`,
  },
  {
    id: 'product-lead',
    label: 'Technical Product Manager',
    roleTitle: 'Senior Technical Product Manager — Cloud Data',
    department: 'Product Management',
    description: 'Product roadmap strategy, GTM launches, SQL analytics, A/B experimentation, and API platform leadership.',
    resumeText: `Priya Nair
New York, NY · priya.nair@pmleader.com · linkedin.com/in/priyanair-pm

SUMMARY
Product Manager with 6 years of experience leading B2B SaaS products, developer tools, and data-driven growth initiatives. Experienced in agile execution, user discovery, and cross-functional team alignment.

EXPERIENCE
Senior Product Manager — CloudPulse SaaS (2022 – Present)
- Owned the multi-quarter product roadmap for the enterprise reporting suite, growing annual recurring revenue by $3.2M (+31% YoY).
- Led cross-functional collaboration across 14 engineers, designers, and data analysts in an Agile Scrum environment.
- Designed and executed A/B testing experiments on self-serve onboarding flows, lifting free-to-paid conversion by 19%.
- Queried customer usage datasets using SQL and Product Analytics (Amplitude, Looker) to define quarterly OKRs and KPIs.

Product Manager — FinFlow API (2019 – 2022)
- Defined product requirements (PRDs) for developer REST APIs and webhook integrations used by 450+ enterprise customers.
- Conducted 60+ customer discovery interviews to prioritize platform reliability and security features.

EDUCATION
B.A. in Economics & Computer Science — Cornell University

SKILLS
Product: Product Roadmap, Agile & Scrum, PRDs, User Research, A/B Testing, Cross-Functional Collaboration
Data & Technical: SQL, Product Analytics (Amplitude, Looker), REST APIs`,
    jobDescriptionText: `Senior Technical Product Manager — Cloud Data & AI Platform

About the Opportunity
We are seeking a Senior Technical Product Manager to define the product strategy, Go-To-Market (GTM) execution, and developer experience for our Cloud Data & Generative AI API platform.

Responsibilities
- Own the end-to-end Product Roadmap & Strategy for our cloud data warehouse integrations (Snowflake, BigQuery) and REST API ecosystem.
- Drive Go-To-Market (GTM) strategy, product launch positioning, and competitive intelligence in partnership with sales and marketing leadership.
- Leverage SQL, Product Analytics & KPIs (Amplitude, Looker), and A/B Testing & Experimentation to optimize developer activation and platform adoption.
- Partner with engineering leadership on System Design, Security & OAuth/OIDC enterprise compliance, and LLM & Generative AI capabilities.
- Lead Cross-Functional Collaboration across engineering, design, and customer success in an Agile & Scrum framework.

Qualifications
- 5+ years in technical product management delivering cloud, data, or API products.
- Demonstrated mastery of Product Roadmap strategy, Go-To-Market (GTM) launches, and A/B Testing.
- Technical fluency in SQL, REST APIs, Security (OAuth/RBAC), and Snowflake or cloud data ecosystems.`,
  },
];
