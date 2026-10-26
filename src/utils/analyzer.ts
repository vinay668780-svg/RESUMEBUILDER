export type SkillCategory =
  | 'Languages & Core'
  | 'Frameworks & Libraries'
  | 'Cloud, Data & Infra'
  | 'Architecture & Methods'
  | 'Product & Leadership';

export type MatchStatus = 'matched' | 'partial' | 'missing';
export type ImportanceLevel = 'Critical' | 'Recommended';

export interface SkillComparisonItem {
  id: string;
  skill: string;
  category: SkillCategory;
  status: MatchStatus;
  importance: ImportanceLevel;
  resumeCount: number;
  jdCount: number;
  matchedSynonyms: string[];
  contextSnippet: string;
  recommendation: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  category: 'Keyword Gap' | 'Impact Quantification' | 'ATS Structure' | 'Role Alignment';
  priority: 'High' | 'Medium';
  diagnosis: string;
  actionableAdvice: string;
  targetKeywords: string[];
  originalExcerpt?: string;
  suggestedRewrite: string;
}

export interface AtsAuditCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ResumeSectionSummary {
  contactDetected: boolean;
  experienceDetected: boolean;
  educationDetected: boolean;
  skillsDetected: boolean;
  quantifiedBulletCount: number;
  totalBulletCount: number;
  wordCount: number;
  estimatedReadTimeSec: number;
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  roleTitle: string;
  candidateName: string;
  overallScore: number;
  hardSkillsScore: number;
  domainScore: number;
  atsScore: number;
  executiveSummary: string;
  skills: SkillComparisonItem[];
  improvements: ImprovementItem[];
  atsChecks: AtsAuditCheck[];
  sectionSummary: ResumeSectionSummary;
  analysisEngine: 'hybrid-gemini' | 'deterministic-nlp';
}

interface TaxonomyEntry {
  canonical: string;
  category: SkillCategory;
  aliases: string[];
  related: string[];
}

export const SKILL_TAXONOMY: TaxonomyEntry[] = [
  // Languages & Core
  { canonical: 'TypeScript', category: 'Languages & Core', aliases: ['typescript', 'ts'], related: ['javascript', 'es6'] },
  { canonical: 'JavaScript', category: 'Languages & Core', aliases: ['javascript', 'js', 'ecmascript', 'es6'], related: ['typescript'] },
  { canonical: 'Python', category: 'Languages & Core', aliases: ['python', 'python3', 'py'], related: ['pandas', 'numpy', 'fastapi'] },
  { canonical: 'Go', category: 'Languages & Core', aliases: ['golang', 'go language'], related: ['rust', 'c++', 'microservices'] },
  { canonical: 'Rust', category: 'Languages & Core', aliases: ['rust', 'rustlang'], related: ['c++', 'go'] },
  { canonical: 'Java', category: 'Languages & Core', aliases: ['java', 'jvm', 'java 17', 'java 21'], related: ['kotlin', 'spring boot'] },
  { canonical: 'SQL', category: 'Languages & Core', aliases: ['sql', 'postgresql', 'postgres', 'mysql', 'tsql', 'pl/sql'], related: ['nosql', 'snowflake', 'bigquery'] },
  { canonical: 'GraphQL', category: 'Languages & Core', aliases: ['graphql', 'apollo graphql', 'gql'], related: ['rest api', 'grpc'] },
  { canonical: 'HTML5 & CSS3', category: 'Languages & Core', aliases: ['html5', 'css3', 'semantic html', 'wcag'], related: ['tailwind css', 'sass'] },
  { canonical: 'C++', category: 'Languages & Core', aliases: ['c++', 'cpp'], related: ['rust', 'c'] },

  // Frameworks & Libraries
  { canonical: 'React', category: 'Frameworks & Libraries', aliases: ['react', 'react.js', 'reactjs', 'react 18', 'react 19'], related: ['next.js', 'vue', 'angular'] },
  { canonical: 'Next.js', category: 'Frameworks & Libraries', aliases: ['next.js', 'nextjs', 'next router', 'ssr'], related: ['react', 'remix'] },
  { canonical: 'Node.js', category: 'Frameworks & Libraries', aliases: ['node.js', 'nodejs', 'express.js', 'express', 'nestjs'], related: ['typescript', 'javascript'] },
  { canonical: 'Tailwind CSS', category: 'Frameworks & Libraries', aliases: ['tailwind', 'tailwind css', 'tailwindcss'], related: ['css3', 'design systems'] },
  { canonical: 'Vue.js', category: 'Frameworks & Libraries', aliases: ['vue', 'vue.js', 'vuejs', 'nuxt'], related: ['react', 'angular'] },
  { canonical: 'Angular', category: 'Frameworks & Libraries', aliases: ['angular', 'angularjs', 'rxjs'], related: ['typescript', 'react'] },
  { canonical: 'FastAPI', category: 'Frameworks & Libraries', aliases: ['fastapi', 'flask', 'django'], related: ['python', 'rest api'] },
  { canonical: 'Spring Boot', category: 'Frameworks & Libraries', aliases: ['spring boot', 'spring framework', 'hibernate'], related: ['java', 'microservices'] },
  { canonical: 'PyTorch', category: 'Frameworks & Libraries', aliases: ['pytorch', 'torch', 'tensorflow', 'keras'], related: ['machine learning', 'deep learning', 'python'] },
  { canonical: 'Scikit-Learn', category: 'Frameworks & Libraries', aliases: ['scikit-learn', 'sklearn', 'xgboost', 'lightgbm'], related: ['python', 'machine learning'] },
  { canonical: 'Pandas & NumPy', category: 'Frameworks & Libraries', aliases: ['pandas', 'numpy', 'scipy'], related: ['python', 'data analysis'] },
  { canonical: 'Playwright & Cypress', category: 'Frameworks & Libraries', aliases: ['playwright', 'cypress', 'selenium', 'e2e testing'], related: ['jest', 'vitest', 'Automated Testing'] },
  { canonical: 'Jest & Vitest', category: 'Frameworks & Libraries', aliases: ['jest', 'vitest', 'unit testing', 'react testing library'], related: ['playwright', 'tdd'] },

  // Cloud, Data & Infra
  { canonical: 'AWS', category: 'Cloud, Data & Infra', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'dynamodb'], related: ['gcp', 'azure', 'cloud architecture'] },
  { canonical: 'Google Cloud (GCP)', category: 'Cloud, Data & Infra', aliases: ['gcp', 'google cloud', 'google cloud platform', 'cloud run', 'bigquery', 'vertex ai'], related: ['aws', 'azure'] },
  { canonical: 'Azure', category: 'Cloud, Data & Infra', aliases: ['azure', 'microsoft azure'], related: ['aws', 'gcp'] },
  { canonical: 'Docker', category: 'Cloud, Data & Infra', aliases: ['docker', 'containerization', 'containers', 'dockerfile'], related: ['kubernetes', 'ci/cd'] },
  { canonical: 'Kubernetes', category: 'Cloud, Data & Infra', aliases: ['kubernetes', 'k8s', 'helm', 'eks', 'gke'], related: ['docker', 'terraform'] },
  { canonical: 'Terraform', category: 'Cloud, Data & Infra', aliases: ['terraform', 'iac', 'infrastructure as code', 'pulumi', 'cloudformation'], related: ['aws', 'kubernetes', 'ci/cd'] },
  { canonical: 'CI/CD Pipelines', category: 'Cloud, Data & Infra', aliases: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'circleci', 'continuous integration'], related: ['docker', 'devops'] },
  { canonical: 'Redis', category: 'Cloud, Data & Infra', aliases: ['redis', 'memcached', 'distributed caching'], related: ['postgresql', 'kafka'] },
  { canonical: 'Kafka & Event Streaming', category: 'Cloud, Data & Infra', aliases: ['kafka', 'apache kafka', 'rabbitmq', 'pubsub', 'event-driven'], related: ['microservices', 'distributed systems'] },
  { canonical: 'Snowflake & Data Warehousing', category: 'Cloud, Data & Infra', aliases: ['snowflake', 'databricks', 'bigquery', 'redshift', 'dbt'], related: ['sql', 'etl pipelines'] },
  { canonical: 'Observability & Monitoring', category: 'Cloud, Data & Infra', aliases: ['datadog', 'prometheus', 'grafana', 'opentelemetry', 'sentry', 'observability'], related: ['sre', 'ci/cd'] },

  // Architecture & Methods
  { canonical: 'REST & gRPC APIs', category: 'Architecture & Methods', aliases: ['rest api', 'restful', 'rest apis', 'grpc', 'openapi', 'swagger'], related: ['graphql', 'microservices'] },
  { canonical: 'Microservices Architecture', category: 'Architecture & Methods', aliases: ['microservices', 'distributed systems', 'service-oriented', 'high availability'], related: ['kubernetes', 'kafka', 'grpc'] },
  { canonical: 'System Design & Scalability', category: 'Architecture & Methods', aliases: ['system design', 'scalability', 'high-scale', 'low latency', 'performance optimization', 'load balancing'], related: ['microservices', 'distributed caching'] },
  { canonical: 'Design Systems', category: 'Architecture & Methods', aliases: ['design systems', 'design system', 'storybook', 'component library', 'figma'], related: ['react', 'tailwind css', 'accessibility (wcag)'] },
  { canonical: 'Accessibility (WCAG)', category: 'Architecture & Methods', aliases: ['accessibility', 'wcag', 'a11y', 'aria', 'screen reader'], related: ['html5', 'design systems'] },
  { canonical: 'LLM & Generative AI', category: 'Architecture & Methods', aliases: ['llm', 'large language models', 'generative ai', 'genai', 'rag', 'prompt engineering', 'vector database', 'embeddings'], related: ['python', 'pytorch'] },
  { canonical: 'Machine Learning & Modeling', category: 'Architecture & Methods', aliases: ['machine learning', 'ml', 'deep learning', 'nlp', 'predictive modeling', 'feature engineering'], related: ['pytorch', 'scikit-learn', 'python'] },
  { canonical: 'ETL & Data Pipelines', category: 'Architecture & Methods', aliases: ['etl', 'data pipelines', 'airflow', 'spark', 'apache spark', 'data engineering'], related: ['sql', 'snowflake', 'python'] },
  { canonical: 'Security & OAuth/OIDC', category: 'Architecture & Methods', aliases: ['oauth', 'oauth2', 'oidc', 'jwt', 'soc2', 'application security', 'rbac', 'encryption'], related: ['rest api', 'cloud architecture'] },
  { canonical: 'Agile & Scrum', category: 'Architecture & Methods', aliases: ['agile', 'scrum', 'kanban', 'sprint planning', 'jira'], related: ['cross-functional collaboration', 'product roadmap'] },

  // Product & Leadership
  { canonical: 'Technical Mentorship', category: 'Product & Leadership', aliases: ['mentorship', 'mentoring', 'coaching', 'code reviews', 'code review', 'onboarding'], related: ['engineering leadership', 'cross-functional collaboration'] },
  { canonical: 'Cross-Functional Collaboration', category: 'Product & Leadership', aliases: ['cross-functional', 'stakeholder management', 'stakeholders', 'product management', 'partnered with product'], related: ['agile', 'technical mentorship'] },
  { canonical: 'A/B Testing & Experimentation', category: 'Product & Leadership', aliases: ['a/b testing', 'experimentation', 'hypothesis testing', 'conversion rate optimization', 'cohort analysis'], related: ['product analytics', 'sql'] },
  { canonical: 'Product Analytics & KPIs', category: 'Product & Leadership', aliases: ['product analytics', 'amplitude', 'mixpanel', 'tableau', 'looker', 'kpi', 'okr', 'metrics'], related: ['a/b testing', 'sql'] },
  { canonical: 'Go-To-Market (GTM) Strategy', category: 'Product & Leadership', aliases: ['go-to-market', 'gtm', 'product launch', 'positioning', 'messaging', 'competitive intelligence', 'market research'], related: ['product roadmap', 'customer segmentation'] },
  { canonical: 'Product Roadmap & Strategy', category: 'Product & Leadership', aliases: ['product roadmap', 'roadmap', 'prd', 'product strategy', 'user research', 'customer discovery'], related: ['cross-functional collaboration', 'agile'] },
];

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function countTermOccurrences(text: string, terms: string[]): { count: number; matchedTerms: string[] } {
  if (!text || !terms.length) return { count: 0, matchedTerms: [] };
  const normalized = text.toLowerCase();
  let total = 0;
  const matchedSet = new Set<string>();

  for (const term of terms) {
    const clean = term.toLowerCase().trim();
    if (!clean) continue;
    // Handle special characters like c++, c#, .net, node.js
    const pattern = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(clean)}(?=$|[^a-z0-9+#.])`, 'gi');
    const matches = normalized.match(pattern);
    if (matches && matches.length > 0) {
      total += matches.length;
      matchedSet.add(term);
    }
  }

  return { count: total, matchedTerms: Array.from(matchedSet) };
}

export function extractContextSnippet(text: string, terms: string[]): string {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const term of terms) {
      const pattern = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(term.toLowerCase())}(?=$|[^a-z0-9+#.])`, 'i');
      if (pattern.test(lower)) {
        const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
        return cleaned.length > 130 ? `${cleaned.slice(0, 127)}...` : cleaned;
      }
    }
  }
  return 'Mentioned in role requirements';
}

export function detectCandidateAndRole(resumeText: string, jdText: string): { candidateName: string; roleTitle: string } {
  const resumeLines = resumeText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let candidateName = 'Candidate Resume';
  if (resumeLines.length > 0) {
    const firstLine = resumeLines[0].replace(/^[#*-\s]+|[#*-\s]+$/g, '').trim();
    if (firstLine.length >= 3 && firstLine.length <= 45 && !firstLine.includes('@') && !/\d{3}/.test(firstLine)) {
      candidateName = firstLine;
    }
  }

  const jdLines = jdText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let roleTitle = 'Target Position';
  for (const line of jdLines.slice(0, 6)) {
    const cleaned = line.replace(/^(job title|role|position)\s*:\s*/i, '').replace(/^[#*-\s]+/, '').trim();
    if (cleaned.length >= 4 && cleaned.length <= 65) {
      roleTitle = cleaned;
      break;
    }
  }

  return { candidateName, roleTitle };
}

export function auditResumeStructure(resumeText: string): {
  summary: ResumeSectionSummary;
  checks: AtsAuditCheck[];
  score: number;
} {
  const lower = resumeText.toLowerCase();
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  const hasPhoneOrLink = /(\+?\d[\d\s().-]{7,}\d|linkedin\.com|github\.com|portfolio)/i.test(resumeText);
  const contactDetected = hasEmail || hasPhoneOrLink;

  const experienceDetected = /\b(experience|employment|work history|career history|professional background)\b/i.test(lower);
  const educationDetected = /\b(education|university|b\.s\.|m\.s\.|bachelor|master|degree|college|academic)\b/i.test(lower);
  const skillsDetected = /\b(skills|technologies|technical stack|core competencies|tooling)\b/i.test(lower);

  const lines = resumeText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter(
    (l) => /^[-*•‣▪]/.test(l) || (l.length > 45 && /\b(led|built|designed|developed|architected|improved|reduced|increased|launched|managed|engineered|created|optimized|delivered|spearheaded)\b/i.test(l))
  );

  const quantifiedBullets = bulletLines.filter((l) =>
    /(\d+%|\$\d+|\d+x|\b\d+\s*(ms|seconds|minutes|hours|days|users|requests|rps|clients|engineers|teams|tb|gb|million|k\b))/i.test(l)
  );

  const totalBulletCount = Math.max(bulletLines.length, 1);
  const quantifiedBulletCount = quantifiedBullets.length;
  const quantRatio = quantifiedBulletCount / totalBulletCount;

  const checks: AtsAuditCheck[] = [
    {
      id: 'ats-contact',
      label: 'Parseable Contact Header',
      passed: contactDetected,
      detail: contactDetected
        ? 'Email address and professional profile links are clearly detectable.'
        : 'Add a direct email address and LinkedIn/GitHub URL at the top of the resume.',
    },
    {
      id: 'ats-sections',
      label: 'Standard Section Headings',
      passed: experienceDetected && skillsDetected && educationDetected,
      detail:
        experienceDetected && skillsDetected && educationDetected
          ? 'Standard Experience, Skills, and Education headings detected for ATS parsers.'
          : `Missing explicit heading for: ${[
              !experienceDetected ? 'Experience' : '',
              !skillsDetected ? 'Skills' : '',
              !educationDetected ? 'Education' : '',
            ]
              .filter(Boolean)
              .join(', ')}.`,
    },
    {
      id: 'ats-quantification',
      label: 'Quantified Impact Metrics',
      passed: quantifiedBulletCount >= 3 || quantRatio >= 0.4,
      detail: `${quantifiedBulletCount} of ${bulletLines.length} accomplishment statements include concrete numbers, percentages, or scale metrics.`,
    },
    {
      id: 'ats-length',
      label: 'Optimal Keyword & Word Density',
      passed: wordCount >= 120 && wordCount <= 1200,
      detail:
        wordCount >= 120
          ? `${wordCount} words analyzed (${Math.max(15, Math.round(wordCount / 3.5))}s recruiter scan time).`
          : `Resume text is brief (${wordCount} words); expand experience bullets to provide sufficient keyword context.`,
    },
  ];

  let score = 40;
  if (contactDetected) score += 15;
  if (experienceDetected) score += 12;
  if (skillsDetected) score += 10;
  if (educationDetected) score += 8;
  score += Math.min(15, Math.round(quantRatio * 25));

  return {
    summary: {
      contactDetected,
      experienceDetected,
      educationDetected,
      skillsDetected,
      quantifiedBulletCount,
      totalBulletCount: bulletLines.length,
      wordCount,
      estimatedReadTimeSec: Math.max(12, Math.round(wordCount / 3.8)),
    },
    checks,
    score: Math.min(100, Math.max(15, score)),
  };
}

/**
 * Extracts custom multi-word or capitalized technical/domain terms from the JD
 * that are not already in the static taxonomy.
 */
function extractDynamicJdKeywords(jdText: string, existingCanonicals: Set<string>): TaxonomyEntry[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'you', 'will', 'our', 'are', 'that', 'this', 'from', 'have',
    'your', 'work', 'team', 'role', 'experience', 'years', 'ability', 'strong', 'skills',
    'working', 'knowledge', 'looking', 'join', 'about', 'what', 'who', 'requirements',
    'responsibilities', 'qualifications', 'preferred', 'bonus', 'plus', 'equal', 'opportunity',
    'company', 'environment', 'build', 'building', 'develop', 'developing', 'support', 'using',
    'including', 'across', 'minimum', 'bachelor', 'master', 'degree', 'computer', 'science',
    'senior', 'staff', 'principal', 'lead', 'junior', 'engineer', 'engineering', 'software',
    'developer', 'full-stack', 'fullstack', 'frontend', 'backend', 'platform', 'core',
    'location', 'hybrid', 'remote', 'san', 'francisco', 'new', 'york', 'seattle', 'overview',
    'opportunity', 'key', 'required', 'about', 'management', 'manager', 'technical', 'applied',
  ].map((s) => s.toLowerCase()));

  // Match capitalized technical nouns or hyphenated terms in JD
  const candidates = new Map<string, number>();
  const matches = jdText.match(/\b([A-Z][A-Za-z0-9+#.-]{2,20}(?:\s+[A-Z][A-Za-z0-9+#.-]{2,20})?)\b/g) || [];

  for (const raw of matches) {
    const cleaned = raw.trim();
    const lower = cleaned.toLowerCase();
    if (stopWords.has(lower)) continue;
    if (cleaned.split(/\s+/).some((w) => stopWords.has(w.toLowerCase()))) continue;
    if (/^\d+$/.test(cleaned)) continue;

    // Skip if already covered by taxonomy
    let covered = false;
    for (const existing of existingCanonicals) {
      if (existing.toLowerCase().includes(lower) || lower.includes(existing.toLowerCase())) {
        covered = true;
        break;
      }
    }
    if (!covered) {
      candidates.set(cleaned, (candidates.get(cleaned) || 0) + 1);
    }
  }

  const dynamicEntries: TaxonomyEntry[] = [];
  for (const [term, count] of candidates.entries()) {
    if (count >= 2 && dynamicEntries.length < 6) {
      dynamicEntries.push({
        canonical: term,
        category: 'Architecture & Methods',
        aliases: [term.toLowerCase()],
        related: [],
      });
    }
  }
  return dynamicEntries;
}

export function analyzeResumeAgainstJob(resumeText: string, jdText: string): AnalysisReport {
  const cleanResume = resumeText.trim();
  const cleanJd = jdText.trim();
  const { candidateName, roleTitle } = detectCandidateAndRole(cleanResume, cleanJd);
  const { summary: sectionSummary, checks: atsChecks, score: atsScore } = auditResumeStructure(cleanResume);

  const existingAliases = new Set<string>();
  for (const entry of SKILL_TAXONOMY) {
    existingAliases.add(entry.canonical);
    entry.aliases.forEach((a) => existingAliases.add(a));
  }

  const dynamicEntries = extractDynamicJdKeywords(cleanJd, existingAliases);
  const fullTaxonomy = [...SKILL_TAXONOMY, ...dynamicEntries];

  const skillItems: SkillComparisonItem[] = [];

  for (const entry of fullTaxonomy) {
    const jdMatch = countTermOccurrences(cleanJd, [entry.canonical, ...entry.aliases]);
    const resumeMatch = countTermOccurrences(cleanResume, [entry.canonical, ...entry.aliases]);

    // Include skill if it's in the JD, OR if it's a core skill in the resume that also relates to the JD
    if (jdMatch.count > 0) {
      const relatedInResume = countTermOccurrences(cleanResume, entry.related);
      let status: MatchStatus = 'missing';
      if (resumeMatch.count > 0) {
        status = 'matched';
      } else if (relatedInResume.count > 0) {
        status = 'partial';
      }

      // Determine importance based on JD frequency or proximity to "required/must"
      const snippet = extractContextSnippet(cleanJd, [entry.canonical, ...entry.aliases]);
      const isRequiredContext = /\b(must|required|essential|core|strong|proven|expert|proficiency)\b/i.test(snippet);
      const importance: ImportanceLevel = jdMatch.count >= 2 || isRequiredContext ? 'Critical' : 'Recommended';

      let recommendation = '';
      if (status === 'matched') {
        recommendation =
          resumeMatch.count >= jdMatch.count
            ? `Strong alignment (${resumeMatch.count} mention${resumeMatch.count > 1 ? 's' : ''} in resume vs ${jdMatch.count} in job description).`
            : `Present in resume (${resumeMatch.count}x), but emphasized ${jdMatch.count}x in the job description—consider featuring it in a top experience bullet.`;
      } else if (status === 'partial') {
        recommendation = `Adjacent skills found (${relatedInResume.matchedTerms.join(', ')}), but the exact keyword "${entry.canonical}" is missing for ATS filters.`;
      } else {
        recommendation = `Add "${entry.canonical}" to your Technical Skills section and demonstrate it in at least one quantified project bullet.`;
      }

      skillItems.push({
        id: `skill-${entry.canonical.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        skill: entry.canonical,
        category: entry.category,
        status,
        importance,
        resumeCount: resumeMatch.count,
        jdCount: jdMatch.count,
        matchedSynonyms: resumeMatch.matchedTerms,
        contextSnippet: snippet,
        recommendation,
      });
    }
  }

  // If the JD was very generic and matched fewer than 4 taxonomy skills, also surface top resume skills
  if (skillItems.length < 4) {
    for (const entry of SKILL_TAXONOMY) {
      if (skillItems.some((s) => s.skill === entry.canonical)) continue;
      const resumeMatch = countTermOccurrences(cleanResume, [entry.canonical, ...entry.aliases]);
      if (resumeMatch.count > 0 && skillItems.length < 8) {
        skillItems.push({
          id: `skill-${entry.canonical.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          skill: entry.canonical,
          category: entry.category,
          status: 'matched',
          importance: 'Recommended',
          resumeCount: resumeMatch.count,
          jdCount: 1,
          matchedSynonyms: resumeMatch.matchedTerms,
          contextSnippet: 'Core competency detected in resume',
          recommendation: `Transferable skill (${resumeMatch.count}x in resume). Connect it directly to the target role's deliverables.`,
        });
      }
    }
  }

  // Sort: Critical first, then missing/partial/matched
  skillItems.sort((a, b) => {
    if (a.importance !== b.importance) return a.importance === 'Critical' ? -1 : 1;
    const order: Record<MatchStatus, number> = { missing: 0, partial: 1, matched: 2 };
    return order[a.status] - order[b.status];
  });

  const scores = computeScoresFromSkills(skillItems, atsScore);
  const improvements = buildImprovements(cleanResume, skillItems, sectionSummary, roleTitle);

  const matchedCount = skillItems.filter((s) => s.status === 'matched').length;
  const partialCount = skillItems.filter((s) => s.status === 'partial').length;
  const missingCritical = skillItems.filter((s) => s.status !== 'matched' && s.importance === 'Critical').map((s) => s.skill);

  const executiveSummary =
    scores.overallScore >= 80
      ? `High alignment (${scores.overallScore}%) for ${roleTitle}. Your resume directly covers ${matchedCount} of ${skillItems.length} target skills.${
          missingCritical.length > 0
            ? ` Incorporating ${missingCritical.slice(0, 3).join(', ')} will close the remaining critical keyword gaps.`
            : ' Focus on elevating quantified business outcomes in your top experience bullets.'
        }`
      : scores.overallScore >= 55
      ? `Moderate alignment (${scores.overallScore}%) for ${roleTitle}, with ${matchedCount} exact skill matches and ${partialCount} adjacent skill matches. Prioritize weaving ${
          missingCritical.slice(0, 4).join(', ') || 'missing domain keywords'
        } into your work history to pass automated ATS screening.`
      : `Foundational alignment (${scores.overallScore}%) for ${roleTitle}. ${
           skillItems.length - matchedCount
        } target skills from the job description are currently missing or phrased differently. Apply the tailored bullet rewrites below to align your terminology with the role.`;

  return {
    id: `rep-${Date.now()}`,
    timestamp: new Date().toISOString(),
    roleTitle,
    candidateName,
    overallScore: scores.overallScore,
    hardSkillsScore: scores.hardSkillsScore,
    domainScore: scores.domainScore,
    atsScore,
    executiveSummary,
    skills: skillItems,
    improvements,
    atsChecks,
    sectionSummary,
    analysisEngine: 'deterministic-nlp',
  };
}

export function computeScoresFromSkills(
  skills: SkillComparisonItem[],
  atsScore: number,
  simulatedSkillIds: Set<string> = new Set()
): {
  overallScore: number;
  hardSkillsScore: number;
  domainScore: number;
} {
  if (skills.length === 0) {
    return { overallScore: Math.round(atsScore * 0.6), hardSkillsScore: 50, domainScore: 50 };
  }

  const effectiveStatus = (item: SkillComparisonItem): MatchStatus =>
    simulatedSkillIds.has(item.id) ? 'matched' : item.status;

  const weightOf = (item: SkillComparisonItem) => (item.importance === 'Critical' ? 2.0 : 1.0);
  const creditOf = (status: MatchStatus) => (status === 'matched' ? 1.0 : status === 'partial' ? 0.45 : 0.0);

  const hardCategories: SkillCategory[] = ['Languages & Core', 'Frameworks & Libraries', 'Cloud, Data & Infra'];
  const domainCategories: SkillCategory[] = ['Architecture & Methods', 'Product & Leadership'];

  const calcCategoryScore = (subset: SkillComparisonItem[], fallback: number) => {
    if (subset.length === 0) return fallback;
    let earned = 0;
    let total = 0;
    for (const s of subset) {
      const w = weightOf(s);
      total += w;
      earned += w * creditOf(effectiveStatus(s));
    }
    return Math.round((earned / total) * 100);
  };

  let allEarned = 0;
  let allTotal = 0;
  for (const s of skills) {
    const w = weightOf(s);
    allTotal += w;
    allEarned += w * creditOf(effectiveStatus(s));
  }
  const baseSkillScore = Math.round((allEarned / allTotal) * 100);

  const hardSkillsScore = calcCategoryScore(
    skills.filter((s) => hardCategories.includes(s.category)),
    baseSkillScore
  );
  const domainScore = calcCategoryScore(
    skills.filter((s) => domainCategories.includes(s.category)),
    baseSkillScore
  );

  const overallScore = Math.min(
    100,
    Math.round(baseSkillScore * 0.68 + atsScore * 0.17 + ((hardSkillsScore + domainScore) / 2) * 0.15)
  );

  return { overallScore, hardSkillsScore, domainScore };
}

function buildImprovements(
  resumeText: string,
  skills: SkillComparisonItem[],
  sectionSummary: ResumeSectionSummary,
  roleTitle: string
): ImprovementItem[] {
  const improvements: ImprovementItem[] = [];
  const missingCritical = skills.filter((s) => s.status === 'missing' && s.importance === 'Critical');
  const partialSkills = skills.filter((s) => s.status === 'partial');
  const missingRecommended = skills.filter((s) => s.status === 'missing' && s.importance === 'Recommended');

  // Find a weak or unquantified bullet in the resume to upgrade
  const lines = resumeText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^[-*•‣]/.test(l) || (l.length > 40 && l.length < 180));

  const unquantifiedLine =
    lines.find((l) => !/(\d+%|\$\d+|\d+x|\b\d+\s*(ms|users|clients|requests))/i.test(l)) ||
    lines[0] ||
    '- Developed and maintained core application features and backend services for production users.';

  // 1. Critical Keyword Gap
  if (missingCritical.length > 0) {
    const topMissing = missingCritical.slice(0, 3).map((s) => s.skill);
    improvements.push({
      id: 'imp-critical-keywords',
      title: `Close Critical Keyword Gaps: ${topMissing.join(', ')}`,
      category: 'Keyword Gap',
      priority: 'High',
      diagnosis: `The job description emphasizes ${topMissing.join(', ')} as core requirements, but they do not appear in your resume text.`,
      actionableAdvice: `Integrate ${topMissing.join(' and ')} into both your Technical Skills block and a concrete accomplishment bullet demonstrating production delivery.`,
      targetKeywords: topMissing,
      originalExcerpt: unquantifiedLine.replace(/^[-*•\s]+/, ''),
      suggestedRewrite: `Architected and delivered production workflows using ${topMissing.join(', ')}, improving system reliability by 34% and reducing p95 response latency across core user journeys.`,
    });
  }

  // 2. Partial / Synonym Alignment
  if (partialSkills.length > 0) {
    const topPartial = partialSkills.slice(0, 3);
    const partialNames = topPartial.map((s) => s.skill);
    improvements.push({
      id: 'imp-synonym-alignment',
      title: `Align Terminology for ATS Exact-Match Filters (${partialNames.join(', ')})`,
      category: 'Role Alignment',
      priority: 'High',
      diagnosis: `Your resume mentions adjacent tools (${topPartial
        .flatMap((s) => s.matchedSynonyms.length ? s.matchedSynonyms : ['related technologies'])
        .slice(0, 3)
        .join(', ')}), but automated ATS keyword filters scan for the exact phrase "${partialNames[0]}".`,
      actionableAdvice: `Mirror the job description's exact phrasing by explicitly pairing your existing experience with ${partialNames.join(', ')}.`,
      targetKeywords: partialNames,
      originalExcerpt: lines[1]?.replace(/^[-*•\s]+/, '') || 'Collaborated with engineering teams to deliver scalable software solutions.',
      suggestedRewrite: `Engineered scalable ${partialNames.join(' and ')} architectures in collaboration with cross-functional product teams, accelerating feature release velocity by 28%.`,
    });
  }

  // 3. Impact Quantification
  if (sectionSummary.quantifiedBulletCount < 4) {
    const matchedTop = skills
      .filter((s) => s.status === 'matched')
      .slice(0, 2)
      .map((s) => s.skill);
    const skillPhrase = matchedTop.length > 0 ? matchedTop.join(' and ') : 'core platform technologies';
    improvements.push({
      id: 'imp-quantify-impact',
      title: 'Strengthen Accomplishment Bullets with Measurable Outcomes',
      category: 'Impact Quantification',
      priority: sectionSummary.quantifiedBulletCount < 2 ? 'High' : 'Medium',
      diagnosis: `Only ${sectionSummary.quantifiedBulletCount} of ${sectionSummary.totalBulletCount} detected experience lines include measurable metrics (%, $, latency, or user scale).`,
      actionableAdvice: `Convert task-oriented descriptions into outcome-driven statements using the "Action Verb + ${skillPhrase} + Quantified Business Result" formula.`,
      targetKeywords: matchedTop,
      originalExcerpt: unquantifiedLine.replace(/^[-*•\s]+/, ''),
      suggestedRewrite: `Spearheaded ${skillPhrase} optimization initiatives for ${roleTitle} workflows, cutting processing overhead by 42% and supporting 150K+ monthly active users with 99.95% uptime.`,
    });
  }

  // 4. Secondary / Recommended Keywords or Executive Summary
  const secondaryTargets =
    missingRecommended.length > 0
      ? missingRecommended.slice(0, 3).map((s) => s.skill)
      : skills.slice(0, 3).map((s) => s.skill);

  improvements.push({
    id: 'imp-executive-summary',
    title: `Tailor Top Summary Header for ${roleTitle}`,
    category: 'ATS Structure',
    priority: 'Medium',
    diagnosis: 'Recruiters spend the first 6–8 seconds scanning the top third of a resume for role-title parity and domain keywords.',
    actionableAdvice: `Include a concise 2-line summary directly beneath your contact header that mirrors "${roleTitle}" and highlights ${secondaryTargets.join(', ')}.`,
    targetKeywords: secondaryTargets,
    suggestedRewrite: `${roleTitle} with proven track record delivering high-impact solutions across ${secondaryTargets.join(', ')}, combining deep technical execution with measurable product outcomes.`,
  });

  return improvements;
}
