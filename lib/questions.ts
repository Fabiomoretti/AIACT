export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: string;
  text: string;
  type: "single" | "multi";
  options: QuestionOption[];
};

export type QuestionSection = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export const sections: QuestionSection[] = [
  {
    id: "profile",
    title: "Profilo organizzazione",
    description: "Inquadriamo dimensione e contesto operativo.",
    questions: [
      {
        id: "organization_type",
        text: "Che tipo di realta rappresenti?",
        type: "single",
        options: [
          { label: "Libero professionista", value: "freelancer" },
          { label: "Micro-impresa", value: "micro" },
          { label: "PMI", value: "pmi" },
          { label: "Azienda oltre 50 dipendenti", value: "company_50_plus" },
          { label: "Studio professionale", value: "professional_studio" },
          { label: "Altro", value: "other" }
        ]
      },
      {
        id: "sector",
        text: "Settore",
        type: "single",
        options: [
          { label: "Marketing/comunicazione", value: "marketing" },
          { label: "Consulenza", value: "consulting" },
          { label: "Software/IT", value: "software_it" },
          { label: "HR", value: "hr" },
          { label: "Sanita", value: "healthcare" },
          { label: "Finanza/assicurazioni", value: "finance" },
          { label: "Formazione", value: "training" },
          { label: "E-commerce", value: "ecommerce" },
          { label: "Altro", value: "other" }
        ]
      },
      {
        id: "employees",
        text: "Numero dipendenti/collaboratori",
        type: "single",
        options: [
          { label: "Solo io", value: "solo" },
          { label: "2-10", value: "2_10" },
          { label: "11-50", value: "11_50" },
          { label: "51-250", value: "51_250" },
          { label: "Oltre 250", value: "250_plus" }
        ]
      }
    ]
  },
  {
    id: "ai_use",
    title: "Uso dell'AI",
    description: "Vediamo quali strumenti sono gia presenti nei processi.",
    questions: [
      {
        id: "uses_ai",
        text: "La tua organizzazione usa strumenti AI?",
        type: "single",
        options: [
          { label: "Si, regolarmente", value: "regularly" },
          { label: "Si, occasionalmente", value: "occasionally" },
          { label: "Stiamo iniziando", value: "starting" },
          { label: "Non lo so", value: "unknown" },
          { label: "No", value: "no" }
        ]
      },
      {
        id: "tools_used",
        text: "Quali strumenti usate?",
        type: "multi",
        options: [
          { label: "ChatGPT / Claude / Gemini / Copilot", value: "llm_tools" },
          { label: "Chatbot sul sito", value: "website_chatbot" },
          { label: "AI per marketing/contenuti", value: "marketing_content" },
          { label: "AI per customer care", value: "customer_care" },
          { label: "AI nel CRM", value: "crm" },
          { label: "AI per analisi dati", value: "data_analysis" },
          { label: "AI per HR/selezione/personale", value: "hr_people" },
          { label: "AI in prodotti o servizi venduti ai clienti", value: "ai_product" },
          { label: "Altro", value: "other" }
        ]
      },
      {
        id: "ai_inventory",
        text: "Avete un elenco aggiornato dei sistemi AI usati?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      }
    ]
  },
  {
    id: "risk",
    title: "Rischio e ambiti sensibili",
    description: "Identifichiamo usi che meritano particolare attenzione.",
    questions: [
      {
        id: "people_decisions",
        text: "L'AI viene usata per prendere o influenzare decisioni su persone?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "hr_use",
        text: "L'AI viene usata in ambiti HR, selezione, valutazione lavoratori o performance?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "sensitive_sectors",
        text: "L'AI viene usata in sanita, credito, assicurazioni, istruzione, servizi essenziali, biometria o sicurezza?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "personal_data",
        text: "L'AI tratta dati personali, dati clienti, dati dipendenti o informazioni riservate?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "public_content",
        text: "L'AI genera contenuti pubblicati verso clienti o pubblico?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      }
    ]
  },
  {
    id: "governance",
    title: "Governance AI Act",
    description: "Misuriamo policy, formazione e controllo operativo.",
    questions: [
      {
        id: "ai_policy",
        text: "Avete una policy interna sull'uso dell'AI?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "ai_training",
        text: "Avete formato dipendenti/collaboratori sull'uso corretto dell'AI?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "output_review",
        text: "Avete una procedura per controllare gli output AI prima dell'uso?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "incident_process",
        text: "Avete una procedura per gestire errori, incidenti, bias o data leak causati da AI?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "vendor_review",
        text: "Avete valutato i fornitori AI e le loro condizioni privacy/sicurezza?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      }
    ]
  },
  {
    id: "transparency",
    title: "Trasparenza e documenti",
    description: "Chiudiamo con informative, registri e percezione di prontezza.",
    questions: [
      {
        id: "ai_transparency",
        text: "Informate utenti/clienti quando interagiscono con AI o ricevono contenuti generati da AI?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "privacy_docs",
        text: "Avete aggiornato informative privacy o registro trattamenti GDPR per l'uso dell'AI?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "ai_documents",
        text: "Avete documenti come registro AI, classificazione rischio, checklist pratiche vietate, valutazione fornitori?",
        type: "single",
        options: [
          { label: "Si", value: "yes" },
          { label: "Parziale", value: "partial" },
          { label: "No", value: "no" },
          { label: "Non so", value: "unknown" }
        ]
      },
      {
        id: "self_readiness",
        text: "Quanto ti senti pronto rispetto all'AI Act?",
        type: "single",
        options: [
          { label: "Molto pronto", value: "very_ready" },
          { label: "Abbastanza pronto", value: "quite_ready" },
          { label: "Poco pronto", value: "little_ready" },
          { label: "Per niente pronto", value: "not_ready" }
        ]
      }
    ]
  }
];

export const allQuestions = sections.flatMap((section) => section.questions);

export const totalQuestionCount = allQuestions.length;
