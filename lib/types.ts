export type AnswerValue = string | string[];

export type Answers = Record<string, AnswerValue>;

export type RiskLevel = "Basso" | "Medio" | "Alto" | "Critico";

export type ResultCategory =
  | "Buon livello di preparazione"
  | "Preparazione parziale"
  | "Rischio organizzativo medio-alto"
  | "Situazione critica o non presidiata";

export type RecommendedOffer =
  | "Kit Base AI Act"
  | "Check-up AI Act Assistito"
  | "Compliance AI Act Completa";

export type AssessmentResult = {
  score: number;
  category: ResultCategory;
  riskLevel: RiskLevel;
  summary: string;
  recommendedOffer: RecommendedOffer;
  riskFlags: string[];
  uncertainties: string[];
  criticalIssues: string[];
  missingDocuments: string[];
  recommendedActions: string[];
  miniIssues: string[];
  miniActions: string[];
};

export type LeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  phone?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  contactRequested: boolean;
  answers: Answers;
  result: AssessmentResult;
  startedAt: number;
  website?: string;
};
