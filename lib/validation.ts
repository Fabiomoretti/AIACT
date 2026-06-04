import { z } from "zod";

const answerValueSchema = z.union([z.string().min(1), z.array(z.string().min(1))]);

const resultSchema = z.object({
  score: z.number().int().min(0).max(100),
  category: z.string().min(1),
  riskLevel: z.string().min(1),
  summary: z.string().min(1),
  recommendedOffer: z.string().min(1),
  riskFlags: z.array(z.string()),
  uncertainties: z.array(z.string()),
  criticalIssues: z.array(z.string()),
  missingDocuments: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  miniIssues: z.array(z.string()),
  miniActions: z.array(z.string())
});

export const leadPayloadSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(2).max(140),
  role: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean(),
  contactRequested: z.boolean(),
  answers: z.record(answerValueSchema),
  result: resultSchema,
  startedAt: z.number().int().positive(),
  website: z.string().max(0).optional()
});
