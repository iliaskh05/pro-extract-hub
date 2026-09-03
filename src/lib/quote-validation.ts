/** Validation partagée client + serveur pour le formulaire de devis. */

export const HOOD_LENGTH_MAX_METERS = 100;
export const FILTER_COUNT_MAX = 200;

const DECIMAL_RE = /^\d+(?:[.,]\d{1,2})?$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeDecimalInput(raw: string): string {
  return raw.trim().replace(",", ".");
}

export function parseMeterage(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: "" };
  if (/[a-zA-Z]/.test(trimmed) || trimmed.includes("m") || /\s/.test(trimmed)) {
    return {
      ok: false,
      error: "Indiquez un nombre uniquement (ex. 3 ou 3,5), sans unité ni lettre.",
    };
  }
  if (!DECIMAL_RE.test(trimmed)) {
    return { ok: false, error: "Format invalide. Exemples acceptés : 3, 3.5, 12." };
  }
  const normalized = normalizeDecimalInput(trimmed);
  if ((normalized.match(/\./g) ?? []).length > 1) {
    return { ok: false, error: "Un seul séparateur décimal est autorisé." };
  }
  const num = Number(normalized);
  if (!Number.isFinite(num) || num <= 0 || num > HOOD_LENGTH_MAX_METERS) {
    return {
      ok: false,
      error: `La valeur doit être comprise entre 0,1 et ${HOOD_LENGTH_MAX_METERS}.`,
    };
  }
  return { ok: true, value: normalized };
}

export function parseFilterCount(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: "" };
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, error: "Le nombre de filtres doit être un entier (ex. 6)." };
  }
  const num = Number(trimmed);
  if (num < 1 || num > FILTER_COUNT_MAX) {
    return {
      ok: false,
      error: `Indiquez un nombre entre 1 et ${FILTER_COUNT_MAX}.`,
    };
  }
  return { ok: true, value: trimmed };
}

export function parseEmail(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const value = raw.trim().toLowerCase();
  if (!value) return { ok: false, error: "Indiquez votre adresse email." };
  if (!EMAIL_RE.test(value)) {
    return { ok: false, error: "Adresse email invalide (ex. contact@entreprise.fr)." };
  }
  return { ok: true, value };
}

export function parsePhone(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const compact = raw.replace(/\s/g, "");
  if (compact.length < 10) {
    return { ok: false, error: "Numéro de téléphone trop court." };
  }
  const phoneRe = /^(?:\+33|0033|0)[1-9](?:[\s.-]?\d{2}){4}$|^\+[1-9]\d{7,14}$/;
  if (!phoneRe.test(compact)) {
    return { ok: false, error: "Numéro de téléphone invalide." };
  }
  return { ok: true, value: raw.trim() };
}

export function parsePostalCode(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (value === "") return { ok: true, value: "" };
  if (!/^\d{5}$/.test(value)) {
    return { ok: false, error: "Code postal français à 5 chiffres." };
  }
  return { ok: true, value };
}
