import type { LeadPayload } from "@/lib/types";

const API_BASE_URL = "https://connect.mailerlite.com/api";
const API_VERSION = "2026-06-09";
const DEFAULT_GROUP_NAME = "Report";
const REQUEST_TIMEOUT_MS = 10_000;

type MailerLiteGroup = {
  id: string;
  name: string;
};

type MailerLiteField = {
  id: string;
  key: string;
  name: string;
  type: "text" | "number" | "date";
};

type ResourceResponse<T> = {
  data: T;
};

type CollectionResponse<T> = {
  data: T[];
};

const fieldDefinitions = [
  { name: "Ruolo AI Act", type: "text" },
  { name: "Punteggio AI Act", type: "number" },
  { name: "Consenso marketing AI Act", type: "text" },
  { name: "Richiesta ricontatto AI Act", type: "text" },
  { name: "Data test AI Act", type: "date" }
] as const;

let resourcesPromise:
  | Promise<{
      groupId: string;
      fieldKeys: Record<(typeof fieldDefinitions)[number]["name"], string>;
    }>
  | undefined;

function configured(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim();

  return normalized.length > 0 && !normalized.startsWith("INSERISCI_QUI");
}

function apiToken() {
  const token = process.env.MAILERLITE_API_TOKEN?.trim();

  if (!configured(token)) {
    throw new Error("MAILERLITE_API_TOKEN non configurato");
  }

  return token as string;
}

function parseErrorBody(body: unknown) {
  if (!body || typeof body !== "object") return "";

  const record = body as Record<string, unknown>;
  const message = typeof record.message === "string" ? record.message : "";
  const errors =
    record.errors && typeof record.errors === "object"
      ? Object.values(record.errors as Record<string, unknown>)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((value): value is string => typeof value === "string")
          .join(" ")
      : "";

  return [message, errors].filter(Boolean).join(" ");
}

async function mailerLiteRequest<T>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiToken()}`,
      "Content-Type": "application/json",
      "X-Version": API_VERSION,
      ...init.headers
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });

  if (response.ok) {
    return (await response.json()) as T;
  }

  const body = await response.json().catch(() => null);
  const canRetry = attempt === 0 && (response.status === 429 || response.status >= 500);

  if (canRetry) {
    const retryAfter = Number(response.headers.get("retry-after") ?? 1);
    await new Promise((resolve) => setTimeout(resolve, Math.min(Math.max(retryAfter, 1), 3) * 1000));
    return mailerLiteRequest<T>(path, init, attempt + 1);
  }

  const detail = parseErrorBody(body);
  throw new Error(`MailerLite API ${response.status}${detail ? `: ${detail}` : ""}`);
}

async function resolveGroupId() {
  const configuredGroupId = process.env.MAILERLITE_REPORT_GROUP_ID?.trim();
  if (configured(configuredGroupId)) return configuredGroupId as string;

  const groupName = process.env.MAILERLITE_REPORT_GROUP_NAME?.trim() || DEFAULT_GROUP_NAME;
  const query = new URLSearchParams({ limit: "1000", "filter[name]": groupName });
  const groups = await mailerLiteRequest<CollectionResponse<MailerLiteGroup>>(`/groups?${query}`);
  const existing = groups.data.find((group) => group.name.trim().toLowerCase() === groupName.toLowerCase());

  if (existing) return existing.id;

  const created = await mailerLiteRequest<ResourceResponse<MailerLiteGroup>>("/groups", {
    method: "POST",
    body: JSON.stringify({ name: groupName })
  });

  return created.data.id;
}

async function resolveFieldKeys() {
  const response = await mailerLiteRequest<CollectionResponse<MailerLiteField>>("/fields?limit=100");
  const fields = [...response.data];

  for (const definition of fieldDefinitions) {
    const existing = fields.find((field) => field.name.trim().toLowerCase() === definition.name.toLowerCase());
    if (existing) continue;

    const created = await mailerLiteRequest<ResourceResponse<MailerLiteField>>("/fields", {
      method: "POST",
      body: JSON.stringify(definition)
    });
    fields.push(created.data);
  }

  return Object.fromEntries(
    fieldDefinitions.map((definition) => {
      const field = fields.find((candidate) => candidate.name.trim().toLowerCase() === definition.name.toLowerCase());
      if (!field) throw new Error(`Campo MailerLite non disponibile: ${definition.name}`);

      return [definition.name, field.key];
    })
  ) as Record<(typeof fieldDefinitions)[number]["name"], string>;
}

function resolveResources() {
  if (!resourcesPromise) {
    resourcesPromise = Promise.all([resolveGroupId(), resolveFieldKeys()])
      .then(([groupId, fieldKeys]) => ({
        groupId,
        fieldKeys
      }))
      .catch((error) => {
        resourcesPromise = undefined;
        throw error;
      });
  }

  return resourcesPromise;
}

function testDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

export async function syncMailerLiteSubscriber(payload: LeadPayload) {
  if (!configured(process.env.MAILERLITE_API_TOKEN)) {
    return {
      synced: false,
      skipped: true,
      reason: "MAILERLITE_API_TOKEN non configurato"
    };
  }

  const { groupId, fieldKeys } = await resolveResources();
  const response = await mailerLiteRequest<ResourceResponse<{ id: string; email: string }>>("/subscribers", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      fields: {
        name: payload.firstName.trim(),
        last_name: payload.lastName.trim(),
        company: payload.company.trim(),
        [fieldKeys["Ruolo AI Act"]]: payload.role.trim(),
        [fieldKeys["Punteggio AI Act"]]: payload.result.score,
        [fieldKeys["Consenso marketing AI Act"]]: payload.marketingConsent ? "Si" : "No",
        [fieldKeys["Richiesta ricontatto AI Act"]]: payload.contactRequested ? "Si" : "No",
        [fieldKeys["Data test AI Act"]]: testDate()
      },
      groups: [groupId]
    })
  });

  return {
    synced: true,
    subscriberId: response.data.id,
    groupId
  };
}
