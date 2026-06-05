export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: string;
  text: string;
  description?: string[];
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
        description: [
          "Questa risposta ci aiuta a capire la dimensione organizzativa e il livello di complessità dei tuoi processi. Un libero professionista avrà esigenze diverse rispetto a una PMI con più reparti, collaboratori e fornitori.",
          "Scegli l’opzione che descrive meglio la tua attività oggi. Se hai dubbi tra due opzioni, scegli quella più strutturata: ad esempio “PMI” se hai team, processi interni e più strumenti digitali usati da persone diverse."
        ],
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
        description: [
          "Il settore è importante perché alcuni ambiti possono comportare rischi più elevati quando usano sistemi AI, soprattutto se coinvolgono persone fisiche, lavoratori, clienti, dati sensibili o servizi essenziali.",
          "Se operi in più settori, scegli quello in cui usi maggiormente l’AI. Se l’AI è usata in HR, sanità, credito, assicurazioni, formazione o servizi essenziali, il test potrebbe suggerire un approfondimento specifico."
        ],
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
        description: [
          "Il numero di persone coinvolte indica quanto l’uso dell’AI sia distribuito. Più persone usano strumenti AI, più diventano importanti policy interne, formazione, responsabilità e controlli.",
          "Conta dipendenti, collaboratori stabili, freelance ricorrenti e persone che usano strumenti AI per conto dell’attività. Anche un piccolo team può avere bisogno di regole chiare se usa AI ogni giorno."
        ],
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
        description: [
          "Questa domanda serve a capire se l’AI è già presente nei processi aziendali. Anche l’uso occasionale di strumenti come ChatGPT, Copilot, Gemini o Canva AI può richiedere regole interne e consapevolezza.",
          "Rispondi “Sì, regolarmente” se l’AI è parte del lavoro quotidiano. “Occasionalmente” se viene usata solo in alcuni casi. “Non lo so” è utile quando l’uso non è ancora censito o dipende dai singoli collaboratori."
        ],
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
        description: [
          "Identificare gli strumenti usati permette di capire dove l’AI entra nei processi: contenuti, customer care, CRM, analisi dati, HR, automazioni o prodotti venduti ai clienti.",
          "Seleziona tutte le opzioni applicabili. Inserisci “Altro” se usi strumenti specifici come Notion AI, Perplexity, Midjourney, Claude, software gestionali con funzioni AI o piattaforme verticali di settore."
        ],
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
        description: [
          "Un registro dei sistemi AI è il primo passo per governare l’uso dell’intelligenza artificiale. Senza inventario è difficile sapere quali dati vengono inseriti, chi usa cosa e con quali finalità.",
          "Rispondi “Sì” solo se esiste un elenco scritto e aggiornato. “Parziale” se avete una lista informale o incompleta. “No” o “Non so” indica che il primo documento da preparare è probabilmente il registro dei sistemi AI."
        ],
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
        description: [
          "Questa è una domanda chiave: un conto è usare l’AI per scrivere una bozza, un altro è usarla per orientare decisioni su clienti, candidati, dipendenti, studenti o utenti.",
          "Rispondi “Sì” anche se l’AI non decide da sola ma suggerisce, ordina, valuta o raccomanda azioni su persone. “Non so” indica che serve analizzare meglio il processo e il ruolo del controllo umano."
        ],
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
        description: [
          "L’uso dell’AI nel lavoro e nella gestione del personale può essere delicato perché può incidere su opportunità, valutazioni, assegnazioni, performance e trattamento dei lavoratori.",
          "Rispondi “Sì” se usi AI per screening CV, colloqui, valutazioni, ranking, monitoraggio performance, produttività o gestione turni. In questi casi il test dovrebbe segnalare la necessità di approfondimento."
        ],
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
        description: [
          "Alcuni ambiti sono più sensibili perché possono incidere su salute, accesso a servizi, diritti, opportunità economiche o identificazione delle persone. Qui il livello di attenzione deve essere più alto.",
          "Rispondi “Sì” se l’AI supporta valutazioni, raccomandazioni, classificazioni o decisioni in uno di questi contesti. Anche se il sistema è fornito da terzi, l’uso concreto va valutato con attenzione."
        ],
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
        description: [
          "Inserire dati personali o informazioni aziendali riservate in strumenti AI può creare rischi privacy, contrattuali e di sicurezza. È importante capire quali dati entrano nel sistema.",
          "Rispondi “Sì” se nei prompt, file caricati, ticket, email o documenti compaiono nomi, contatti, dati clienti, dati dipendenti, contratti, listini, strategie, codice o informazioni non pubbliche."
        ],
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
        description: [
          "Quando testi, immagini, audio, video o risposte generate da AI arrivano a clienti, utenti o pubblico, diventano importanti revisione umana, accuratezza, copyright e trasparenza.",
          "Rispondi “Sì” se l’AI contribuisce a newsletter, articoli, social post, immagini, email commerciali, risposte customer care, materiali formativi, presentazioni o documenti consegnati ai clienti."
        ],
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
        description: [
          "Una policy interna stabilisce quali strumenti AI si possono usare, per quali finalità, quali dati non vanno inseriti, chi controlla gli output e cosa fare in caso di errore.",
          "Rispondi “Sì” se esiste un documento approvato e comunicato al team. “Parziale” se ci sono istruzioni informali, email o regole non ancora strutturate. “No” segnala una lacuna importante."
        ],
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
        description: [
          "L’AI literacy serve a far usare gli strumenti AI con consapevolezza: limiti, rischi, privacy, bias, allucinazioni, verifica degli output e responsabilità umana.",
          "Rispondi “Sì” se la formazione è stata fatta e documentata. “Parziale” se solo alcune persone sono state formate. “No” o “Non so” indica che serve un piano formativo minimo."
        ],
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
        description: [
          "Gli output AI possono essere plausibili ma sbagliati. Una procedura di controllo umano definisce chi verifica, cosa controlla e quando un output può essere usato o pubblicato.",
          "Rispondi “Sì” se esiste un processo chiaro e applicato. “Parziale” se la revisione avviene ma non è documentata. Se nessuno controlla gli output, il rischio operativo aumenta."
        ],
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
        description: [
          "Serve sapere cosa fare quando l’AI sbaglia: output discriminatori, dati inseriti per errore, informazioni false, risposte dannose, reclami o uso non autorizzato.",
          "Rispondi “Sì” se avete canali, responsabili e registro incidenti. “Parziale” se gestite i problemi caso per caso. “No” indica che manca una procedura di escalation."
        ],
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
        description: [
          "Molti strumenti AI sono forniti da terzi. È utile verificare termini di servizio, privacy policy, uso dei dati per training, DPA, sicurezza, localizzazione dati, subfornitori e limiti d’uso.",
          "Rispondi “Sì” se la valutazione è documentata. “Parziale” se avete controllato solo alcuni fornitori. “No” o “Non so” segnala la necessità di una due diligence sui tool principali."
        ],
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
        description: [
          "In alcuni casi è necessario o opportuno informare le persone quando interagiscono con un sistema AI o quando un contenuto è generato o manipolato con AI.",
          "Rispondi “Sì” se usi avvisi chiari su chatbot, contenuti AI, immagini, video, audio o risposte assistite da AI. “Parziale” se lo fai solo in alcuni canali. “No” indica possibile lacuna di trasparenza."
        ],
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
        description: [
          "Quando l’AI tratta dati personali, la documentazione privacy può dover essere aggiornata: informative, registro trattamenti, accordi con fornitori, valutazioni privacy o DPIA nei casi più delicati.",
          "Rispondi “Sì” se l’uso dell’AI è già documentato anche lato privacy. “Parziale” se avete aggiornato solo alcuni documenti. “Non so” è un segnale per coinvolgere il referente privacy o DPO."
        ],
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
        description: [
          "Questa domanda misura il livello documentale. Non basta usare l’AI con buon senso: serve poter dimostrare quali strumenti usi, perché, con quali limiti e quali controlli.",
          "Rispondi “Sì” se questi documenti sono compilati e aggiornati. “Parziale” se esistono solo alcune bozze. “No” indica che il Kit Base AI Act può essere il primo passo operativo."
        ],
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
        description: [
          "Questa è un’autovalutazione finale. Serve a confrontare la percezione interna con le risposte date: a volte ci si sente pronti, ma mancano registro, policy, formazione o valutazione fornitori.",
          "Scegli la risposta più onesta. Se ti senti “poco” o “per niente” pronto, il report darà priorità pratiche. Se ti senti pronto ma emergono lacune, il test segnalerà cosa consolidare."
        ],
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
