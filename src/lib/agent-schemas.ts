import { Type, Schema } from '@google/genai';

export const adjacentCareerSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        related_careers: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    career_path: { type: Type.STRING },
                    composite_score: { type: Type.INTEGER },
                    demand_status: { type: Type.STRING, description: "In-Demand, Emerging, or Stable" },
                    rationale: { type: Type.STRING }
                },
                required: ["career_path", "composite_score", "demand_status", "rationale"]
            }
        }
    },
    required: ["related_careers"]
};

export const sessionIntakeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        career_goal: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                confidence: { type: Type.STRING },
                note: { type: Type.STRING }
            },
            required: ["title", "source", "confidence", "note"]
        },
        personal_interests_and_strengths: {
            type: Type.OBJECT,
            properties: {
                interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                academic_fit: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, nullable: true },
                        source: { type: Type.STRING, nullable: true },
                        aptitude_clusters: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["summary", "source", "aptitude_clusters"]
                }
            },
            required: ["interests", "strengths", "academic_fit"]
        },
        family_and_financial_situation: {
            type: Type.OBJECT,
            properties: {
                family_support: { type: Type.STRING },
                financial_barrier: { type: Type.STRING },
                details: { type: Type.STRING, nullable: true }
            },
            required: ["family_support", "financial_barrier", "details"]
        },
        concerns_and_red_flags: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["type", "description"]
            }
        },
        counselors_overall_impression: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                recommended_next_step: { type: Type.STRING }
            },
            required: ["summary", "recommended_next_step"]
        }
    },
    required: [
        "career_goal",
        "personal_interests_and_strengths",
        "family_and_financial_situation",
        "concerns_and_red_flags",
        "counselors_overall_impression"
    ]
};

export const assessmentExtractionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        document_type: { type: Type.STRING },
        school_year: { type: Type.STRING, nullable: true },
        grade_level: { type: Type.STRING, nullable: true },
        extracted_data: {
            type: Type.OBJECT,
            properties: {
                general_scholastic_aptitude: { type: Type.NUMBER, nullable: true },
                domains: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            score: { type: Type.NUMBER },
                            descriptor: { type: Type.STRING, nullable: true }
                        },
                        required: ["name", "score"]
                    }
                },
                subjects: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            grades: {
                                type: Type.OBJECT,
                                properties: {
                                    q1: { type: Type.NUMBER, nullable: true },
                                    q2: { type: Type.NUMBER, nullable: true },
                                    q3: { type: Type.NUMBER, nullable: true },
                                    q4: { type: Type.NUMBER, nullable: true },
                                    final: { type: Type.NUMBER, nullable: true }
                                }
                            },
                            remarks: { type: Type.STRING, nullable: true }
                        },
                        required: ["name", "grades"]
                    }
                },
                general_average: { type: Type.NUMBER, nullable: true }
            }
        }
    },
    required: ["document_type", "extracted_data"]
};

export const keySignalSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        icon: { type: Type.STRING },
        label: { type: Type.STRING },
        value: { type: Type.STRING },
        sub_note: { type: Type.STRING, nullable: true }
    },
    required: ["icon", "label", "value"]
};

export const scoreBreakdownSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        label: { type: Type.STRING },
        value: { type: Type.INTEGER },
        weight: { type: Type.STRING }
    },
    required: ["label", "value", "weight"]
};

export const jobDemandSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        verdict: { type: Type.STRING },
        key_signals: {
            type: Type.ARRAY,
            items: keySignalSchema
        },
        summary: { type: Type.STRING },
        score_breakdown: {
            type: Type.ARRAY,
            items: scoreBreakdownSchema
        },
        supporting_data: {
            type: Type.ARRAY,
            items: keySignalSchema
        }
    },
    required: ["score", "verdict", "key_signals", "summary", "score_breakdown", "supporting_data"]
};

export const laborMarketSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        verdict: { type: Type.STRING },
        key_signals: {
            type: Type.ARRAY,
            items: keySignalSchema
        },
        summary: { type: Type.STRING },
        score_breakdown: {
            type: Type.ARRAY,
            items: scoreBreakdownSchema
        },
        supporting_data: {
            type: Type.ARRAY,
            items: keySignalSchema
        }
    },
    required: ["score", "verdict", "key_signals", "summary", "score_breakdown", "supporting_data"]
};

export const feasibilitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        verdict: { type: Type.STRING },
        key_signals: {
            type: Type.ARRAY,
            items: keySignalSchema
        },
        summary: { type: Type.STRING },
        score_breakdown: {
            type: Type.ARRAY,
            items: scoreBreakdownSchema
        },
        supporting_data: {
            type: Type.ARRAY,
            items: keySignalSchema
        }
    },
    required: ["score", "verdict", "key_signals", "summary", "score_breakdown", "supporting_data"]
};

export const notesAnalysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        careerGoal: { type: Type.STRING },
        interests: { type: Type.STRING },
        financial: { type: Type.STRING },
        concerns: { type: Type.STRING },
        impression: { type: Type.STRING }
    },
    required: ["careerGoal", "interests", "financial", "concerns", "impression"]
};
