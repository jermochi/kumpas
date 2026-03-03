export interface DocumentationSectionType {
  title: string;
  paragraphs: string[];
  references?: { label: string; url: string }[];
}

export const documentationContent: DocumentationSectionType[] = [
  {
    title: "Global Sustainability Frameworks & SDG 8",
    paragraphs: [
      "The United Nations' Sustainable Development Goal 8 (SDG 8) provides a holistic framework for promoting sustained, inclusive economic growth, full and productive employment, and decent work for all. In the Philippine educational system, achieving this goal requires optimizing career pathing for students through data-backed methodologies.",
      "Kumpas integrates directly with these global economic goals by synthesizing quantitative data from official National Achievement Test (NAT) and National Career Assessment Examination (NCAE) results, alongside qualitative insights from counselor interview notes. By automating the extraction and analysis of this complex data, the system assists guidance counselors in generating holistic baseline profiles, allowing them to reallocate their time toward meaningful, direct interactions with students."
    ],
    references: [
      { label: "United Nations Sustainable Development Goals", url: "https://sdgs.un.org/" }
    ]
  },
  {
    title: "Labor Market Analysis via DOLE/LMI Framework",
    paragraphs: [
      "To provide actionable and relevant career guidance, our platform integrates the Department of Labor and Employment's Labor Market Information (DOLE/LMI) framework. This structural approach allows the AI to contextualize a student's academic profile against real-world economic demands, identifying high-growth sectors and emerging job trends within the local and global economy.",
      "By cross-referencing extracted test percentiles and categorical data with current DOLE/LMI reports, the system ensures that the career pathways suggested are not merely aligned with the student's aptitude but are economically viable, directly contributing to the objective of decent work and sustainable growth."
    ],
    references: [
      { label: "DOLE Bureau of Local Employment", url: "https://ble.dole.gov.ph/" },
      { label: "Labor Market Information", url: "https://psa.gov.ph/statistics/labor-force-survey" }
    ]
  },
  {
    title: "Career Feasibility Assessment",
    paragraphs: [
      "The Feasibility Assessment model evaluates raw cognitive and aptitude metrics from the uploaded NAT and NCAE documents. It supplements this quantitative data with the counselor's notes regarding the student's personal interests and academic history.",
      "By standardizing both the physical test documents via OCM and the qualitative textual insights via natural language processing, the system is able to compute the academic and technical viability of specific career tracks. This dual-faceted approach ensures recommendations are rigorously grounded in both standardized benchmarking and personalized advisory insights."
    ],
    references: [
      { label: "Predictive Analytics in Education", url: "https://www.jstor.org/stable/predictive-analytics-education" }
    ]
  },
  {
    title: "Psychological & Occupational Analysis (JD-R Model)",
    paragraphs: [
      "To ensure comprehensive student well-being, the system applies the Job Demands-Resources (JD-R) model to evaluate the prospective occupational context. The AI heavily utilizes the qualitative counselor interview notes to gauge a student's personal resilience, constraints, and stress tolerance.",
      "By balancing the inherent psychological and technical demands of a target profession against the student's observed emotional and academic resources, the system filters for sustainable career paths. This nuanced psychological analysis translates broad assessment data into a practical framework for mental health and long-term career persistence."
    ],
    references: [
      { label: "The Job Demands-Resources Model (Demerouti et al.)", url: "https://psycnet.apa.org/record/2001-17079-005" },
      { label: "Psychological Well-being and the JD-R Model", url: "https://www.jstor.org/stable/20159599" }
    ]
  }
];