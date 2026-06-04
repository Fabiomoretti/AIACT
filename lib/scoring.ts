import type { Answers, AssessmentResult, RecommendedOffer, ResultCategory, RiskLevel } from "@/lib/types";

const readinessQuestionIds = [
  "uses_ai",
  "ai_inventory",
  "people_decisions",
  "hr_use",
  "sensitive_sectors",
  "personal_data",
  "public_content",
  "ai_policy",
  "ai_training",
  "output_review",
  "incident_process",
  "vendor_review",
  "ai_transparency",
  "privacy_docs",
  "ai_documents",
  "self_readiness"
];

const documents = {
  inventory: "Registro sistemi AI",
  roles: "Mappatura ruoli AI Act",
  classification: "Classificazione rischio",
  prohibited: "Checklist pratiche vietate",
  policy: "Policy uso AI",
  literacy: "Procedura AI literacy",
  vendors: "Valutazione fornitori AI",
  oversight: "Procedura human oversight",
  incidents: "Procedura gestione incidenti AI",
  logs: "Registro log e tracciabilita",
  transparency: "Informativa trasparenza AI",
  privacy: "Aggiornamento documentazione privacy/GDPR"
};

const actions = {
  inventory: "Creare un inventario dei sistemi AI usati",
  classify: "Classificare i sistemi per livello di rischio",
  policy: "Adottare una policy interna sull'uso dell'AI",
  training: "Formare dipendenti e collaboratori",
  vendors: "Valutare fornitori AI e condizioni privacy/sicurezza",
  transparency: "Predisporre informative di trasparenza",
  oversight: "Definire controllo umano sugli output",
  incidents: "Preparare procedura incidenti AI",
  specialist: "Fare una valutazione specialistica se ci sono usi ad alto rischio"
};

function single(answers: Answers, id: string) {
  const value = answers[id];
  return typeof value === "string" ? value : "";
}

function multi(answers: Answers, id: string) {
  const value = answers[id];
  return Array.isArray(value) ? value : [];
}

function scoreAnswer(id: string, value: string) {
  if (id === "uses_ai") {
    if (value === "regularly") return 5;
    if (value === "occasionally") return 4;
    if (value === "starting") return 3;
    return 0;
  }

  if (["people_decisions", "hr_use", "sensitive_sectors", "personal_data", "public_content"].includes(id)) {
    if (value === "no") return 5;
    if (value === "yes") return 2;
    return 0;
  }

  if (id === "self_readiness") {
    if (value === "very_ready") return 5;
    if (value === "quite_ready") return 3;
    if (value === "little_ready") return 1;
    return 0;
  }

  if (value === "yes") return 5;
  if (value === "partial") return 2;
  return 0;
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function categoryFor(score: number): ResultCategory {
  if (score >= 75) return "Buon livello di preparazione";
  if (score >= 50) return "Preparazione parziale";
  if (score >= 25) return "Rischio organizzativo medio-alto";
  return "Situazione critica o non presidiata";
}

function riskLevelFor(score: number, flags: string[]): RiskLevel {
  if (score <= 24) return "Critico";
  if (flags.some((flag) => flag.includes("alto rischio") || flag.includes("approfondimento"))) return "Alto";
  if (score <= 49) return "Alto";
  if (score <= 74) return "Medio";
  return "Basso";
}

function offerFor(score: number, flags: string[]): RecommendedOffer {
  if (score <= 24 || flags.some((flag) => flag.includes("approfondimento"))) {
    return "Compliance AI Act Completa";
  }

  if (score <= 49 || flags.some((flag) => flag.includes("alto rischio"))) {
    return "Check-up AI Act Assistito";
  }

  if (score <= 74) return "Check-up AI Act Assistito";

  return "Kit Base AI Act";
}

function summaryFor(category: ResultCategory) {
  if (category === "Buon livello di preparazione") {
    return "Hai gia alcune basi operative. Conviene consolidare documenti, procedure e monitoraggio per ridurre incertezze e mantenere continuita nel tempo.";
  }

  if (category === "Preparazione parziale") {
    return "Ci sono elementi avviati, ma mancano documenti o procedure importanti. Un check-up mirato puo chiarire priorita, responsabilita e prossimi passi.";
  }

  if (category === "Rischio organizzativo medio-alto") {
    return "L'uso dell'AI e presente, ma la governance sembra insufficiente. Serve mettere ordine su inventario, policy, controlli e trasparenza.";
  }

  return "La situazione appare critica o non presidiata. Servono rapidamente inventario, policy, formazione, classificazione rischio e valutazione fornitori.";
}

export function calculateAssessment(answers: Answers): AssessmentResult {
  let rawScore = 0;
  const maxScore = readinessQuestionIds.length * 5;
  const riskFlags: string[] = [];
  const uncertainties: string[] = [];
  const criticalIssues: string[] = [];
  const missingDocuments: string[] = [];
  const recommendedActions: string[] = [];

  readinessQuestionIds.forEach((id) => {
    const value = single(answers, id);
    rawScore += scoreAnswer(id, value);
    if (value === "unknown") {
      uncertainties.push(`Risposta non certa su: ${id}`);
    }
  });

  const tools = multi(answers, "tools_used");
  const usesAi = single(answers, "uses_ai");
  const aiIsUsed = ["regularly", "occasionally", "starting"].includes(usesAi) || tools.length > 0;

  if (single(answers, "people_decisions") === "yes") {
    riskFlags.push("Uso AI che puo influenzare decisioni su persone: possibile alto rischio");
    missingDocuments.push(documents.classification, documents.oversight, documents.roles);
    recommendedActions.push(actions.classify, actions.oversight, actions.specialist);
  }

  if (single(answers, "hr_use") === "yes" || tools.includes("hr_people")) {
    riskFlags.push("Uso AI in HR o gestione persone: richiede approfondimento");
    missingDocuments.push(documents.classification, documents.oversight, documents.prohibited);
    recommendedActions.push(actions.specialist, actions.classify);
  }

  if (single(answers, "sensitive_sectors") === "yes") {
    riskFlags.push("Uso AI in ambiti sensibili: richiede approfondimento specialistico");
    missingDocuments.push(documents.classification, documents.oversight, documents.logs);
    recommendedActions.push(actions.specialist, actions.classify);
  }

  if (single(answers, "personal_data") === "yes" && !["yes", "partial"].includes(single(answers, "privacy_docs"))) {
    riskFlags.push("Uso di dati personali senza adeguata valutazione privacy/GDPR");
    rawScore -= 8;
    missingDocuments.push(documents.privacy);
    recommendedActions.push(actions.vendors);
  }

  if (single(answers, "public_content") === "yes" && !["yes", "partial"].includes(single(answers, "ai_transparency"))) {
    riskFlags.push("AI verso clienti o pubblico senza trasparenza sufficiente");
    rawScore -= 8;
    missingDocuments.push(documents.transparency);
    recommendedActions.push(actions.transparency);
  }

  if (aiIsUsed && !["yes", "partial"].includes(single(answers, "ai_inventory"))) {
    criticalIssues.push("Non risulta presente un registro aggiornato dei sistemi AI.");
    missingDocuments.push(documents.inventory);
    recommendedActions.push(actions.inventory);
  }

  if (!["yes", "partial"].includes(single(answers, "ai_policy"))) {
    criticalIssues.push("Manca una policy interna sull'uso dell'AI.");
    missingDocuments.push(documents.policy);
    recommendedActions.push(actions.policy);
  }

  if (!["yes", "partial"].includes(single(answers, "ai_training"))) {
    criticalIssues.push("Manca un percorso di formazione AI literacy per dipendenti o collaboratori.");
    missingDocuments.push(documents.literacy);
    recommendedActions.push(actions.training);
  }

  if (!["yes", "partial"].includes(single(answers, "ai_documents"))) {
    criticalIssues.push("Mancano documenti di base come classificazione rischio, checklist e valutazione fornitori.");
    missingDocuments.push(documents.roles, documents.classification, documents.prohibited, documents.vendors);
    recommendedActions.push(actions.classify, actions.vendors);
  }

  if (!["yes", "partial"].includes(single(answers, "output_review"))) {
    missingDocuments.push(documents.oversight);
    recommendedActions.push(actions.oversight);
  }

  if (!["yes", "partial"].includes(single(answers, "incident_process"))) {
    missingDocuments.push(documents.incidents);
    recommendedActions.push(actions.incidents);
  }

  if (!["yes", "partial"].includes(single(answers, "vendor_review"))) {
    missingDocuments.push(documents.vendors);
    recommendedActions.push(actions.vendors);
  }

  if (!["yes", "partial"].includes(single(answers, "ai_transparency"))) {
    missingDocuments.push(documents.transparency);
    recommendedActions.push(actions.transparency);
  }

  if (!["yes", "partial"].includes(single(answers, "privacy_docs"))) {
    missingDocuments.push(documents.privacy);
  }

  if (
    !["yes", "partial"].includes(single(answers, "ai_policy")) &&
    !["yes", "partial"].includes(single(answers, "ai_training")) &&
    !["yes", "partial"].includes(single(answers, "ai_documents"))
  ) {
    rawScore -= 12;
    riskFlags.push("Governance AI minima assente: policy, formazione e registro non risultano presidiati");
  }

  const normalized = Math.max(0, Math.min(100, Math.round((rawScore / maxScore) * 100)));
  const category = categoryFor(normalized);
  const riskLevel = riskLevelFor(normalized, riskFlags);
  const recommendedOffer = offerFor(normalized, riskFlags);

  const fallbackIssues = [
    "Alcune risposte indicano aree da chiarire prima delle prossime scadenze operative dell'AI Act.",
    "La documentazione AI sembra migliorabile rispetto a inventario, responsabilita e procedure."
  ];

  const fallbackActions = [
    actions.inventory,
    actions.policy,
    actions.training,
    actions.classify,
    actions.vendors
  ];

  const fullIssues = unique([...criticalIssues, ...riskFlags, ...fallbackIssues]);
  const fullActions = unique([...recommendedActions, ...fallbackActions]);

  return {
    score: normalized,
    category,
    riskLevel,
    summary: summaryFor(category),
    recommendedOffer,
    riskFlags: unique(riskFlags),
    uncertainties,
    criticalIssues: fullIssues.slice(0, 5),
    missingDocuments: unique(missingDocuments),
    recommendedActions: fullActions.slice(0, 7),
    miniIssues: fullIssues.slice(0, 2),
    miniActions: fullActions.slice(0, 2)
  };
}
