export interface DocumentationSectionType {
  title: string;
  paragraphs: string[];
  references?: { label: string; url: string }[];
}

export const documentationContent: DocumentationSectionType[] = [
  {
    title: "Global Sustainability Frameworks & SDG 8",
    paragraphs: [
      "The United Nations' Sustainable Development Goal 8 (SDG 8) provides a holistic framework for promoting sustained, inclusive economic growth, full and productive employment, and decent work for all. In the Philippine educational system, achieving this goal is hindered by systemic challenges within guidance counseling, where professionals are burdened by administrative overload and role ambiguity. Administrative duties, such as paperwork, record-keeping, and event organization, occupy a substantial 70% of their time, eclipsing the essence of counseling itself.",
      "Our integrated tool complements these global economic goals by assessing labor market trends and guiding student career responses through dedicated feasibility and labor market analysis. By automating complex administrative tasks, the tool reallocates time back to core counseling functions, addressing the overwhelming burden that diverts counselors from engaging in direct, meaningful interactions with students. This analytical framing helps quantify labor market demands and inform career adaptation strategies, ensuring students are prepared for productive employment in line with sustainable economic development.",
      "At the organizational level, this technological integration provides a structured framework to advocate for the counseling profession and address the pervasive issue of low remuneration. With entry-level salaries ranging from 17,000 to 20,000 PHP, the current compensation does not align with the importance and impact of the counseling role. Together, these systemic changes—redefining administrative structures, implementing standardized technological tools, and demanding equitable compensation—supply the high-level principles and management systems that ground a comprehensive sustainability assessment for Philippine education."
    ],
    references: [
      { label: "United Nations Sustainable Development Goals", url: "https://sdgs.un.org/" }
    ]
  },
  {
    title: "Labor Market Analysis via DOLE/LMI Framework",
    paragraphs: [
      "To provide actionable and relevant career guidance, our platform integrates the Department of Labor and Employment's Labor Market Information (DOLE/LMI) framework. This structural approach allows the AI to contextualize the student's career aspirations against real-world economic demands, identifying high-growth sectors and emerging job trends within the local and global economy.",
      "By analyzing counselor-client conversation audio, the system cross-references expressed student interests with current DOLE/LMI data. This ensures that the career pathways suggested are not only aligned with the student's aptitude but are also economically viable and sustainable, directly contributing to the objective of decent work and economic growth."
    ],
    references: [
      { label: "DOLE Bureau of Local Employment", url: "https://ble.dole.gov.ph/" },
      { label: "Labor Market Information", url: "https://psa.gov.ph/statistics/labor-force-survey" }
    ]
  },
  {
    title: "Career Development & Feasibility (SCCT)",
    paragraphs: [
      "The Social Cognitive Career Theory (SCCT) is utilized to assess the feasibility of the student’s career choices based on their self-efficacy beliefs, outcome expectations, and personal goals. The tool processes conversational cues to evaluate how environmental factors, barriers, and support systems influence the student's academic and career development.",
      "Through advanced audio analysis, the system identifies key psychological markers related to confidence and perceived obstacles. It then maps these against potential adjacent careers, providing the counselor with a data-driven overview of the student's cognitive landscape. This enables highly personalized interventions that help students navigate challenges and expand their perceived career options."
    ],
    references: [
      { label: "Social Cognitive Career Theory (Lent, Brown, & Hackett)", url: "https://psycnet.apa.org/record/1994-44243-001" },
      { label: "Applications of SCCT in Career Counseling", url: "https://www.researchgate.net/publication/225083988_Social_Cognitive_Career_Theory" }
    ]
  },
  {
    title: "Psychological Analysis (JD-R Model)",
    paragraphs: [
      "To ensure comprehensive student well-being, the system incorporates the Job Demands-Resources (JD-R) model. Originally designed to measure occupational stress and motivation, this framework is adapted to evaluate the educational demands placed on students versus the resources (academic, emotional, and social) available to them.",
      "By recognizing patterns in the client's voice, including tone and expressed anxieties, the AI assesses the balance between student 'demands' (academic pressure, expectations) and 'resources' (counseling support, coping mechanisms). This psychological analysis capability translates broad student development goals into practical criteria for mental health and career readiness, helping to standardize the quality of care across institutions."
    ],
    references: [
      { label: "The Job Demands-Resources Model (Demerouti et al.)", url: "https://psycnet.apa.org/record/2001-17079-005" },
      { label: "Psychological Well-being and the JD-R Model", url: "https://www.jstor.org/stable/20159599" }
    ]
  }
];