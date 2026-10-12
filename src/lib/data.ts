/*
 * Single source of content for the site. Components only read from here.
 *
 * Source of truth: the résumé (Aryan_Tanwar_Resume_FT-2, not published on the site),
 * plus the master résumé (Aryan_Tanwar_Master_Resume.tex) and Aryan_Tanwar_Resume_FT-General.pdf
 * for the Toyota project, coursework and the peer-tutor line. Nothing here is invented:
 * if it is not in one of those files, it is not on the site.
 */

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  headline: { lead: string; accent: string };
  eyebrow: string;
  intro: string;
  aboutLead: string;
  aboutInterests: { text: string; accent: string };
  quote: string;
  email: string;
  location: string;
  linkedin: string;
};

export const PROFILE: Profile = {
  name: "Aryan Tanwar",
  firstName: "Aryan",
  initials: "AT",
  eyebrow: "MSIS · Kelley School of Business · Dec 2026",
  headline: { lead: "Good strategy, like good food,", accent: "is all about the ingredients." },
  intro:
    "I connect business, data, and AI to make complex decisions feel simple.",
  aboutLead:
    "I'm completing a Master of Science in Information Systems at Indiana University's Kelley School of Business (December 2026), after a B.S. in Business with majors in Information Systems and Business Analytics. My internships span strategy & operations at CooperSurgical, audit & assurance at Deloitte and business analytics at BDO.",
  aboutInterests: {
    text: "Off the clock: Avicii, drums, rowing, cooking global cuisines, certified barista, and",
    accent: "tiramisu.",
  },
  // Paraphrase of the résumé's own recurring wording ("translating … into clear, stakeholder-ready … recommendations").
  quote: "Translating complex analysis into clear, stakeholder-ready recommendations.",
  email: "atanwar@iu.edu",
  location: "Bloomington, IN",
  linkedin: "https://www.linkedin.com/in/aryantanwar/",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof NAV)[number]["id"];

/* ---------------------------------------------------------------- Skills */

export const SKILL_FAMILIES = [
  "Strategy",
  "Analytics",
  "Data & Cloud",
  "AI & Automation",
  "Commercial",
  "Finance",
] as const;
export type SkillFamily = (typeof SKILL_FAMILIES)[number];

export type Skill = {
  name: string;
  symbol: string;
  family: SkillFamily;
  /** Key into the TechLogo BRAND map, when an official mark is available. */
  logo?: string;
  /** Where the résumé shows this skill in use. Empty = listed in the skills section only. */
  usedIn: string[];
};

export const SKILL_GROUPS: Skill[] = [
  // Strategy
  { name: "Product Strategy", symbol: "Ps", family: "Strategy", usedIn: ["Toyota Material Handling"] },
  { name: "Go-to-Market Strategy", symbol: "Gt", family: "Strategy", usedIn: ["CooperSurgical"] },
  { name: "Roadmapping", symbol: "Rm", family: "Strategy", usedIn: ["Toyota Material Handling", "Kelley MSIS research"] },
  { name: "Requirements Gathering", symbol: "Rq", family: "Strategy", usedIn: ["Toyota Material Handling", "Kelley MSIS research"] },
  { name: "Business Case Development", symbol: "Bc", family: "Strategy", usedIn: ["Allianz Life × EY"] },
  { name: "Structured Problem-Solving", symbol: "Sp", family: "Strategy", usedIn: [] },
  { name: "Agile (Scrum/Kanban)", symbol: "Ag", family: "Strategy", usedIn: ["MSIS coursework"] },
  { name: "Stakeholder Management", symbol: "Sm", family: "Strategy", usedIn: ["Deloitte", "Allianz Life × EY"] },
  // Analytics
  { name: "Python", symbol: "Py", family: "Analytics", logo: "python", usedIn: ["Cornell VC Data Science Lab", "CooperSurgical"] },
  { name: "SQL", symbol: "Sq", family: "Analytics", usedIn: ["Cornell VC Data Science Lab", "BDO Global"] },
  { name: "Power BI", symbol: "Pb", family: "Analytics", usedIn: ["BDO Global"] },
  { name: "Tableau", symbol: "Tb", family: "Analytics", usedIn: [] },
  { name: "Advanced Excel", symbol: "Ex", family: "Analytics", usedIn: ["CooperSurgical", "Deloitte"] },
  { name: "VBA", symbol: "Vb", family: "Analytics", usedIn: [] },
  { name: "Time Series Forecasting", symbol: "Ts", family: "Analytics", usedIn: ["Kelley MSIS research"] },
  { name: "Account Segmentation", symbol: "As", family: "Analytics", usedIn: ["CooperSurgical"] },
  // Data & Cloud
  { name: "Snowflake", symbol: "Sf", family: "Data & Cloud", logo: "snowflake", usedIn: ["Toyota Material Handling"] },
  { name: "SAP S/4HANA", symbol: "Sa", family: "Data & Cloud", logo: "sap", usedIn: ["Toyota Material Handling", "MSIS coursework"] },
  { name: "Cloud Architecture (AWS)", symbol: "Aw", family: "Data & Cloud", usedIn: ["MSIS coursework"] },
  { name: "Data Governance / MDM", symbol: "Dg", family: "Data & Cloud", usedIn: ["Toyota Material Handling"] },
  { name: "Jira", symbol: "Ji", family: "Data & Cloud", logo: "jira", usedIn: ["Grainger Inc"] },
  { name: "Confluence", symbol: "Cf", family: "Data & Cloud", logo: "confluence", usedIn: [] },
  { name: "Web Scraping", symbol: "Ws", family: "Data & Cloud", usedIn: ["CooperSurgical"] },
  { name: "Data Analysis", symbol: "Da", family: "Data & Cloud", usedIn: ["BDO Global", "Cornell VC Data Science Lab"] },
  // AI & Automation
  { name: "Machine Learning", symbol: "Ml", family: "AI & Automation", usedIn: [] },
  { name: "RAG Pipelines", symbol: "Rg", family: "AI & Automation", usedIn: [] },
  { name: "Prompt Engineering", symbol: "Pe", family: "AI & Automation", usedIn: ["Kelley MSIS research"] },
  { name: "N8N", symbol: "N8", family: "AI & Automation", logo: "n8n", usedIn: ["Kelley MSIS research"] },
  { name: "Google TimesFM", symbol: "Tf", family: "AI & Automation", logo: "google", usedIn: ["Kelley MSIS research"] },
  { name: "Automations", symbol: "Au", family: "AI & Automation", usedIn: ["CooperSurgical", "Kelley MSIS research"] },
  // Commercial
  { name: "Salesforce", symbol: "Sl", family: "Commercial", usedIn: ["CooperSurgical", "Grainger Inc"] },
  { name: "HubSpot", symbol: "Hs", family: "Commercial", logo: "hubspot", usedIn: ["CooperSurgical"] },
  { name: "CRM Management", symbol: "Cr", family: "Commercial", usedIn: ["CooperSurgical"] },
  { name: "Market & Competitive Research", symbol: "Mr", family: "Commercial", usedIn: ["Deloitte"] },
  // Finance
  { name: "Financial Modeling", symbol: "Fm", family: "Finance", usedIn: ["Allianz Life × EY", "MSIS coursework"] },
  { name: "ROI & NPV Analysis", symbol: "Rn", family: "Finance", usedIn: ["Allianz Life × EY"] },
  { name: "Budgeting", symbol: "Bu", family: "Finance", usedIn: ["BDO Global"] },
  { name: "Variance Analysis", symbol: "Va", family: "Finance", usedIn: [] },
  { name: "KPI Development", symbol: "Kp", family: "Finance", usedIn: ["BDO Global"] },
  { name: "Financial Statement Analysis", symbol: "Fs", family: "Finance", usedIn: ["Deloitte"] },
];

/** One-liner per skill, shown on the toolkit card (desktop) and in the key's pop-up (phone). */
export const SKILL_LINES: Record<string, string> = {
  // Strategy
  "Product Strategy": "Turning messy business problems into AI-powered products — like Grainger's cross-team planning tool.",
  "Go-to-Market Strategy": "Found the 50 networks worth chasing across 38K+ IVF accounts at CooperSurgical.",
  Roadmapping: "Turned technical complexity into a transformation roadmap for Toyota's digital enterprise.",
  "Requirements Gathering": "Asking the right questions before building the right solutions — from Toyota to Grainger.",
  "Business Case Development": "Made the numbers tell the story: a $6.45M NPV and 68% ROI for Allianz's IAM investment.",
  "Structured Problem-Solving": "Turned 2,214 manual product-link checks into one automated workflow at CooperSurgical.",
  "Agile (Scrum/Kanban)": "Bringing teams, feedback, and changing requirements together through Grainger's AI product development.",
  "Stakeholder Management": "Translating complex ideas into decisions that business and technical teams can both get behind.",
  // Analytics
  Python: "Turned 10+ years of messy VC investment data into meaningful trends at Cornell.",
  SQL: "Connected the dots behind live executive dashboards at BDO and historical VC data at Cornell.",
  "Power BI": "Built 5+ executive dashboards at BDO, putting revenue, profitability, and KPIs in one view.",
  Tableau: "Analyzed SAP S/4HANA ERP data in Tableau for a Kelley ERP class, turning complex transactions into visuals that make patterns easy to spot and decisions easier to make.",
  "Advanced Excel": "Excel is my home base: I taught it to 200+ Kelley students as a K201/K303 peer tutor, and I use advanced Excel to build dashboards, clean large datasets, and model the numbers behind a decision.",
  VBA: "Taking repetitive spreadsheet tasks off autopilot's opposite: manual work.",
  "Time Series Forecasting": "Helped turn USDA commodity data into forward-looking price insights through Kelley AI research.",
  "Account Segmentation": "Sorted 38K+ IVF clinic accounts into 12 actionable tiers at CooperSurgical.",
  // Data & Cloud
  Snowflake: "Designed a governed data lakehouse to bring Toyota's scattered enterprise data together.",
  "SAP S/4HANA": "From analyzing S/4HANA ERP data in a Kelley ERP class to helping shape Toyota's SAP-centered architecture, I know how enterprise systems fit together.",
  "Cloud Architecture (AWS)": "Exploring cloud infrastructure that helps data and applications scale beyond local systems.",
  "Data Governance / MDM": "Built governance into Toyota's data architecture and helped shape Kelley's ethical AI roadmap.",
  Jira: "Connected Jira's project data to an AI tool tracking 41 dependencies across 10 Grainger teams.",
  Confluence: "Bringing scattered project knowledge together to support clearer cross-team collaboration.",
  "Web Scraping": "Helped uncover 628 broken links by automating CooperSurgical's 2,214-link catalog audit.",
  "Data Analysis": "From VC investments at Cornell to IVF markets at CooperSurgical, I turn data into direction.",
  // AI & Automation
  "Machine Learning": "Explored machine learning for turning historical commodity prices into future-looking insights at Kelley.",
  "RAG Pipelines": "Fed Grainger's AI planning agent the right project context to uncover downstream impacts.",
  "Prompt Engineering": "Turning plain-English business questions into actionable AI workflows at Grainger.",
  N8N: "Connected USDA data and AI forecasting into an automated workflow during Kelley research.",
  "Google TimesFM": "Used Google's TimesFM 2.5 to prototype AI-powered commodity price forecasting at Kelley.",
  Automations: "From 2,214 product links to commodity forecasts, I make repetitive processes work smarter.",
  // Commercial
  Salesforce: "Used CRM insights to research IVF providers and support outreach at CooperSurgical.",
  HubSpot: "Helped turn 47 physician outreach targets into organized, trackable engagement at CooperSurgical.",
  "CRM Management": "Connected provider research, account data, and engagement tracking to smarter commercial decisions.",
  "Market & Competitive Research": "From industry and equity research at Edelweiss to IPO prospects at Deloitte and competitor benchmarks at BDO, I size up markets and what it takes to win them.",
  // Finance
  "Financial Modeling": "Building models that turn assumptions into decisions, from long-term value analysis in Edelweiss equity research to an $11M cybersecurity investment case for Allianz.",
  "ROI & NPV Analysis": "Built the case for $18.77M in net benefits, $6.45M NPV, and 68% ROI for Allianz.",
  Budgeting: "Benchmarked costs and performance at BDO to find opportunities for tighter financial control.",
  "Variance Analysis": "Used client performance benchmarks at BDO to uncover gaps between results and expectations.",
  "KPI Development": "Put revenue, profitability, and operational performance on 5+ live dashboards at BDO.",
  "Financial Statement Analysis": "Reading the story behind the numbers, from investor reports on Dixon Technologies and Adani Ports at Edelweiss to IPO-readiness reviews at Deloitte.",
};

/* -------------------------------------------------------------- Projects */

export type Project = {
  id: string;
  index: string;
  title: string;
  client: string;
  kicker: string;
  dates: string;
  description: string;
  features: string[];
  tech: string[];
  visual: "ripple" | "lakehouse" | "roi" | "stock";
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "grainger",
    index: "01",
    title: "AI Product Development",
    client: "Grainger Inc",
    kicker: "Kelley School of Business · capstone",
    dates: "Aug 2026 – Present",
    description:
      "An AI product for a Fortune 500 distributor that sits on top of Jira and Salesforce to predict how a single change ripples across 10 teams and 41 cross-team dependencies, unifying commitments, handoffs, staffing and budgets into a single view.",
    features: [
      "One view of commitments, handoffs, staffing and budgets",
      "41 cross-team dependencies across 10 teams",
      "What-if agent: plain-English change → updated plan",
      "Surfaces downstream schedule, staffing and dependency impact",
    ],
    tech: ["Jira", "Salesforce", "Prompt Engineering", "Automations"],
    visual: "ripple",
  },
  {
    id: "toyota",
    index: "02",
    title: "Unified Digital Enterprise Product Strategy",
    client: "Toyota Material Handling North America",
    kicker: "Kelley School of Business",
    dates: "Nov 2025 – Dec 2025",
    description:
      "Data and product strategy for a multi-entity digital transformation: requirements for a hybrid SAP S/4HANA, SAP BTP and API Mesh architecture, and a governed Snowflake Medallion lakehouse consolidating SAP ECC, JDE and legacy SQL sources.",
    features: [
      "Hybrid SAP S/4HANA, SAP BTP and API Mesh architecture",
      "Snowflake Medallion lakehouse over SAP ECC, JDE and legacy SQL",
      "Unified data dictionary and governance across 3 legacy systems",
      "Projected 20–40% reduction in month-end close time",
    ],
    tech: ["SAP S/4HANA", "Snowflake", "Data Governance / MDM", "Requirements Gathering"],
    visual: "lakehouse",
  },
  {
    id: "allianz",
    index: "03",
    title: "IAM Transformation Business Case & ROI Strategy",
    client: "Allianz Life × EY",
    kicker: "Kelley School of Business",
    dates: "Oct 2025 – Nov 2025",
    description:
      "The business case for an $11M Identity and Access Management investment, modeling risk, efficiency, cost and key compliance metrics, presented to EY Cyber Consulting leadership as a capital-allocation recommendation.",
    features: [
      "$18.77M projected net benefits",
      "$6.45M NPV",
      "68% ROI on an $11M investment",
      "Presented to EY Cyber Consulting leadership",
    ],
    tech: ["Financial Modeling", "ROI & NPV Analysis", "Business Case Development", "Advanced Excel"],
    visual: "roi",
  },
  {
    id: "smart-stock",
    index: "04",
    title: "AI Ingredient-Price Forecasting",
    client: "Smart Stock AI",
    kicker: "Kelley MSIS research",
    dates: "Jul 2025 – Aug 2025",
    description:
      "A predictive inventory tool for small restaurants: it pulls vegetable prices from USDA Market News, forecasts them 7 and 30 days out with Google TimesFM, and turns the outlook into clear reorder calls.",
    features: [
      "Automated USDA Market News price ingestion with N8N",
      "7- and 30-day forecasts with Google TimesFM, tested against ARIMA",
      "Reorder alerts from shelf life, storage and usage",
      "A simple dashboard for restaurant managers",
    ],
    tech: ["Google TimesFM", "N8N", "Web Scraping", "Time Series Forecasting"],
    visual: "stock",
  },
];

/* ---------------------------------------------- Experience + education */

export type PathStop = {
  kind: "work" | "education";
  year: string;
  dates: string;
  title: string;
  place: string;
  detail: string[];
};

/** Chronological, oldest first. Education and experience share one path. */
export const EXPERIENCE: PathStop[] = [
  {
    kind: "work",
    year: "2022",
    dates: "Aug 2022 – Nov 2022",
    title: "Research Assistant, Venture Capital Data Science Lab",
    place: "Cornell University",
    detail: [
      "Consolidated 10+ years of VC investment data using Python and SQL, cleaning historical records to uncover multi-year funding trends and support portfolio reviews.",
    ],
  },
  {
    kind: "work",
    year: "2023",
    dates: "Jun 2023 – Aug 2023",
    title: "Business Analytics Intern",
    place: "BDO Global LLP",
    detail: [
      "Built 5+ executive Power BI dashboards connected to live SQL data sources for real-time visibility into revenue, profitability and operational KPIs.",
      "Benchmarked client financial and operational metrics against industry standards to recommend targeted improvements.",
    ],
  },
  {
    kind: "work",
    year: "2024",
    dates: "Jun 2024 – Aug 2024",
    title: "Audit & Assurance Intern",
    place: "Deloitte",
    detail: [
      "Supported IPO readiness for 3 clients through IGAAP-to-Ind AS transitions, analyzing regulatory requirements, financial statements and ERP migration risks.",
      "Identified 20+ prospective IPO candidates from market, sector and financial trends.",
    ],
  },
  {
    kind: "work",
    year: "2025",
    dates: "Jul 2025 – Aug 2025",
    title: "Research Assistant, Generative AI & LLM Product Development",
    place: "Kelley School of Business · MSIS Program",
    detail: [
      "Prototyped an AI-powered commodity forecasting workflow with N8N, USDA datasets and Google TimesFM 2.5.",
      "Synthesized 15+ sources on AI platforms, prompt tuning, automation and governance into recommendations for the program's AI investment roadmap.",
    ],
  },
  {
    kind: "education",
    year: "2025",
    dates: "Aug 2025",
    title: "B.S. Business, Information Systems & Business Analytics",
    place: "Indiana University, Kelley School of Business",
    detail: ["GPA 3.60 / 4.00.", "Peer Tutor for K201/K303 core tech courses."],
  },
  {
    kind: "work",
    year: "2026",
    dates: "Jun 2026 – Aug 2026",
    title: "Strategy & Operations Intern",
    place: "CooperSurgical · Trumbull, CT",
    detail: [
      "Built an account segmentation model across 38K+ IVF clinic accounts, tiering them into 12 segments and surfacing the top 50 provider networks for 2027 go-to-market planning.",
      "Reconciled 2,000+ product links in a single run by automating a manual line-by-line audit with Excel and web-scraping workflows.",
    ],
  },
  {
    kind: "education",
    year: "2026",
    dates: "Expected Dec 2026",
    title: "M.S. Information Systems (MSIS)",
    place: "Indiana University, Kelley School of Business",
    detail: [
      "Coursework: Tech Consulting, Financial Modeling, AI Workflows & Governance, Cloud Architecture (AWS), SAP S/4HANA, Agile.",
    ],
  },
];

export const EDUCATION = EXPERIENCE.filter((s) => s.kind === "education");

/* ------------------------------------------- Experience map (ontology) */

export type MapKind = "Internships" | "Research" | "Projects" | "Education";

export type MapPlace = {
  id: string;
  /** Short label under the node. */
  label: string;
  place: string;
  kind: MapKind;
  /** Rough position on the timeline (fractional years), used to lay the map out left → right. */
  t: number;
  /** File in /public/organizations, when the organisation has a logo. */
  logo?: string;
  roles: { title: string; dates: string; points: string[] }[];
  /** Skills this place connects to (keys of MAP_SKILLS). */
  skills: string[];
};

/** Skills that tie the places together, by family. */
export const MAP_SKILLS: Record<string, "Analytics" | "Finance" | "AI" | "Data & Cloud" | "Strategy"> = {
  Python: "Analytics",
  SQL: "Analytics",
  Excel: "Analytics",
  "Power BI": "Analytics",
  "Statistical modeling": "Analytics",
  Forecasting: "Analytics",
  Segmentation: "Analytics",
  "Market research": "Strategy",
  "Equity research": "Finance",
  "Financial analysis": "Finance",
  "Financial modeling": "Finance",
  "DCF & NPV": "Finance",
  "Audit & compliance": "Finance",
  Stakeholders: "Strategy",
  Agile: "Strategy",
  N8N: "AI",
  TimesFM: "AI",
  "Prompt tuning": "AI",
  "AI governance": "AI",
  Snowflake: "Data & Cloud",
  "SAP S/4HANA": "Data & Cloud",
  "Data governance": "Data & Cloud",
  "Web scraping": "Data & Cloud",
  AWS: "Data & Cloud",
  Jira: "Data & Cloud",
  Salesforce: "Data & Cloud",
};

/** Every place on the experience map. Roles and points are taken from the résumé. */
export const MAP_PLACES: MapPlace[] = [
  {
    id: "edelweiss", label: "Edelweiss", place: "Edelweiss Financial Services Limited", kind: "Internships", t: 2021.5, logo: "edelweiss",
    roles: [
      {
        title: "Investment Research and Analysis Intern", dates: "Jun 2022 – Aug 2022",
        points: [
          "Conducted in-depth industry research on the global ball bearings sector by analyzing market size, end-use applications, and product diversification to assess overall industry growth potential.",
          "Evaluated supply chain dynamics and cost structures, benchmarking global market leaders to assess competitive positioning.",
        ],
      },
      {
        title: "Sector Investment and Research Intern", dates: "May 2021 – Jul 2021",
        points: [
          "Produced investor reports on Dixon Technologies by evaluating manufacturing capacity, demand trends, and market dynamics to identify key growth drivers and investment risks.",
          "Authored equity research on Adani Ports, analyzing operational performance of global port operators, financial trends, and industry benchmarks to assess competitive positioning and long-term value potential.",
        ],
      },
    ],
    skills: ["Equity research", "Market research", "Financial analysis"],
  },
  {
    id: "cornell", label: "Cornell", place: "Cornell University", kind: "Research", t: 2022.7, logo: "cornell",
    roles: [{
      title: "Research Assistant, Venture Capital Data Science Lab", dates: "Aug 2022 – Nov 2022",
      points: [
        "Consolidated, cleaned, and validated records from venture capital firms using Python and Excel, applying statistical modeling and optimization techniques to resolve data inconsistencies and achieve analytical accuracy for academic research publication.",
        "Analyzed 10+ years of multi-source VC investment data using statistical methods to identify funding trends and sector-specific strategies, delivering insights that drove portfolio performance reviews and capital allocation decisions.",
      ],
    }],
    skills: ["Python", "Excel", "Statistical modeling", "SQL"],
  },
  {
    id: "bdo", label: "BDO", place: "BDO Global LLP", kind: "Internships", t: 2023.5, logo: "bdo",
    roles: [{
      title: "Business Analytics Intern", dates: "Jun 2023 – Aug 2023",
      points: [
        "Designed 5+ executive-level Power BI dashboards integrating cross-functional SQL data sources, enabling real-time performance monitoring of revenue, expense, and profitability KPIs across client portfolios for C-suite decision-making.",
        "Analyzed product performance KPIs and benchmarked against industry competitors to identify market positioning gaps, informing strategic recommendations that improved revenue performance and competitive differentiation.",
      ],
    }],
    skills: ["Power BI", "SQL", "Market research"],
  },
  {
    id: "deloitte", label: "Deloitte", place: "Deloitte", kind: "Internships", t: 2024.5, logo: "deloitte",
    roles: [{
      title: "Audit and Assurance Intern", dates: "Jun 2024 – Aug 2024",
      points: [
        "Supported IPO readiness for 3 clients through regulatory compliance analysis and ERP data migration risk assessment (IGAAP to Ind AS), translating complex technical findings into structured implementation roadmaps addressing M&A accounting treatment.",
        "Identified 20+ potential IPO candidates through market and sector analysis, delivering full audit support including financial risk assessments, process walkthroughs, and compliance testing, in collaboration with senior auditors and leadership.",
      ],
    }],
    skills: ["Audit & compliance", "Financial analysis", "Market research", "Stakeholders"],
  },
  {
    id: "msis-research", label: "MSIS research", place: "Kelley School of Business · MSIS Program", kind: "Research", t: 2025.55, logo: "kelley",
    roles: [{
      title: "Research Assistant, AI Systems & Machine Learning (under MSIS Program Chair)", dates: "Jul 2025 – Aug 2025",
      points: [
        "Engineered an AI research workflow using N8N to automate real-time data ingestion from the USDA website, feeding structured outputs into Google TimesFM 2.5 and ensemble forecasting models to solve large-scale ingredient price prediction challenges in supply chain optimization.",
        "Researched deep learning and prompt tuning techniques across AI-assisted development platforms (Claude, Windsurf, Copilot), systematically benchmarking capabilities, limitations, and workflow integration patterns.",
        "Synthesized findings from 15+ sources into a research report on ethical AI governance and emerging development tooling, presenting recommendations to MSIS leadership.",
        "That forecasting research became Smart Stock AI, an ingredient-price forecasting tool for small restaurants (see Things I've built).",
      ],
    }],
    skills: ["N8N", "TimesFM", "Forecasting", "Prompt tuning", "AI governance", "Stakeholders"],
  },
  {
    id: "kelley-bs", label: "Kelley · BS", place: "Indiana University, Kelley School of Business", kind: "Education", t: 2025.62, logo: "kelley",
    roles: [{
      title: "B.S. Business; Majors: Information Systems, Business Analytics", dates: "Aug 2025 · GPA 3.60 / 4.00",
      points: [
        "Academic research paper: applied a transaction cost economics framework to evaluate how interfirm governance structures influence strategic pivots in startups, identifying key cost and control trade-offs.",
        "Peer Tutor, K201 & K303 (Computer in Business): guided 200+ students in Excel, databases, and enterprise systems through hands-on instruction.",
      ],
    }],
    skills: ["Excel", "SQL", "SAP S/4HANA"],
  },
  {
    id: "allianz", label: "Allianz × EY", place: "Allianz Life × EY", kind: "Projects", t: 2025.8, logo: "allianz",
    roles: [{
      title: "Cybersecurity Investment Financial Analysis – IAM Transformation", dates: "Oct 2025 – Nov 2025",
      points: [
        "Built a risk-adjusted financial model quantifying $18.77M in projected net benefits by statistically modeling breach probability distributions, operational efficiency gains, and compliance cost reductions across a 5-year horizon.",
        "Executed a complete DCF and WACC analysis on an $11M IAM investment to deliver a $6.45M NPV, 68% ROI, and Year-1 breakeven projection; presented sensitivity analysis to EY Cyber Consulting leadership.",
      ],
    }],
    skills: ["Financial modeling", "DCF & NPV", "Excel", "Statistical modeling", "Stakeholders"],
  },
  {
    id: "toyota", label: "Toyota", place: "Toyota Material Handling North America", kind: "Projects", t: 2025.9, logo: "toyota",
    roles: [{
      title: "Unified Digital Enterprise Product Strategy", dates: "Nov 2025 – Dec 2025",
      points: [
        "Hybrid SAP S/4HANA, SAP BTP and API Mesh architecture.",
        "Snowflake Medallion lakehouse over SAP ECC, JDE and legacy SQL.",
        "Unified data dictionary and governance across 3 legacy systems.",
      ],
    }],
    skills: ["SAP S/4HANA", "Snowflake", "Data governance", "SQL"],
  },
  {
    id: "smart-stock", label: "Smart Stock AI", place: "Smart Stock AI", kind: "Projects", t: 2025.65,
    roles: [{
      title: "AI Ingredient-Price Forecasting", dates: "Jul 2025 – Aug 2025",
      points: [
        "Automated USDA Market News price ingestion with N8N.",
        "7- and 30-day forecasts with Google TimesFM, tested against ARIMA.",
        "Reorder alerts from shelf life, storage and usage.",
      ],
    }],
    skills: ["TimesFM", "N8N", "Forecasting", "Web scraping", "Python"],
  },
  {
    id: "coopersurgical", label: "CooperSurgical", place: "CooperSurgical · Trumbull, CT", kind: "Internships", t: 2026.45, logo: "coopersurgical",
    roles: [{
      title: "Strategy & Operations Intern", dates: "Jun 2026 – Aug 2026",
      points: [
        "Built an account segmentation model across 38K+ IVF clinic accounts, tiering them into 12 segments and surfacing the top 50 provider networks for 2027 go-to-market planning.",
        "Reconciled 2,000+ product links in a single run by automating a manual line-by-line audit with Excel and web-scraping workflows.",
      ],
    }],
    skills: ["Segmentation", "Excel", "Web scraping", "Salesforce", "Python", "Market research"],
  },
  {
    id: "grainger", label: "Grainger", place: "Grainger Inc", kind: "Projects", t: 2026.7, logo: "grainger",
    roles: [{
      title: "AI Product Development · Kelley MSIS capstone", dates: "Aug 2026 – Present",
      points: [
        "Building an AI product for a Fortune 500 distributor that sits on top of Jira and Salesforce to predict how a single change ripples across 10 teams and 41 cross-team dependencies.",
        "Unifies commitments, handoffs, staffing and budgets into a single view, so planners can see the whole picture in one place.",
        "What-if agent: describe a change in plain English and get an updated plan back.",
        "Surfaces the downstream schedule, staffing and dependency impact before a decision is made.",
      ],
    }],
    skills: ["Jira", "Salesforce", "Prompt tuning", "Agile", "Stakeholders"],
  },
  {
    id: "kelley-msis", label: "Kelley · MSIS", place: "Indiana University, Kelley School of Business", kind: "Education", t: 2026.9, logo: "kelley",
    roles: [{
      title: "Master of Science in Information Systems (MSIS); Computer Science & Data Science", dates: "Expected Dec 2026",
      points: [
        "Coursework: Tech Consulting, Financial Modeling, AI Workflows & Governance, Cloud Architecture (AWS), SAP S/4HANA, Agile.",
      ],
    }],
    skills: ["AWS", "SAP S/4HANA", "Agile", "AI governance", "Financial modeling"],
  },
];

/* ------------------------------------------------------- Impact numbers */

export type Achievement = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
  source: string;
  icon: "segments" | "links" | "roi" | "network" | "archive" | "search" | "dashboard" | "grade";
};

export const ACHIEVEMENTS: Achievement[] = [
  { value: 38, suffix: "K+", label: "IVF clinic accounts", caption: "Segmented into 12 tiers; top 50 networks surfaced for 2027 GTM", source: "CooperSurgical · 2026", icon: "segments" },
  { value: 2000, suffix: "+", label: "Product links reconciled", caption: "In a single automated run, replacing a line-by-line audit", source: "CooperSurgical · 2026", icon: "links" },
  { value: 18.77, decimals: 2, prefix: "$", suffix: "M", label: "Projected net benefits", caption: "$11M IAM investment case · $6.45M NPV · 68% ROI", source: "Allianz Life × EY · 2025", icon: "roi" },
  { value: 41, label: "Cross-team dependencies", caption: "Modeled across 10 teams to predict how one change ripples", source: "Grainger Inc · 2026", icon: "network" },
  { value: 10, suffix: "+ yrs", label: "VC investment data", caption: "Consolidated and cleaned with Python and SQL", source: "Cornell University · 2022", icon: "archive" },
  { value: 20, suffix: "+", label: "IPO candidates identified", caption: "From market, sector and financial trend analysis", source: "Deloitte · 2024", icon: "search" },
  { value: 5, suffix: "+", label: "Executive Power BI dashboards", caption: "Connected to live SQL data sources", source: "BDO Global · 2023", icon: "dashboard" },
];

/** No certifications are listed on the résumé, so the Certifications section is omitted. */
export const CERTIFICATIONS: { title: string; issuer: string }[] = [];

export const ID_CARD = {
  band: "PORTFOLIO ID",
  rows: [
    ["School", "Kelley"],
    ["Majors", "IS · Analytics"],
    ["Valid till", "Dec 2026"],
  ] as [string, string][],
  back: [
    { icon: "grad", title: "3 years, 1 undergrad degree.", text: "Apparently, I was in a hurry." },
    {
      icon: "spark",
      title: "1 more degree, a million more questions.",
      text: "Stayed at Kelley to explore where business meets technology.",
    },
    {
      icon: "chef",
      title: "Part-time strategist, full-time foodie.",
      text: "Equally excited about a good AI use case and a good plate of pasta.",
    },
  ] as { icon: "grad" | "spark" | "chef"; title: string; text: string }[],};

export const QUICK_FACTS: [string, string][] = [
  ["Based", "Bloomington, IN"],
  ["Education", "MSIS, Kelley · Dec 2026"],
  ["Latest role", "Strategy & Operations Intern, CooperSurgical"],
  ["Now", "AI product development, Grainger Inc capstone"],
];
