/** Départements d'Île-de-France — pôle Paris (faisabilité confirmée en limite). */

export type IdfDepartment = {
  code: string;
  name: string;
  hub: string;
  note: string;
};

export const IDF_DEPARTMENTS: IdfDepartment[] = [
  {
    code: "75",
    name: "Paris",
    hub: "20 arrondissements",
    note: "Cœur du pôle — restaurants, hôtels, enseignes urbaines.",
  },
  {
    code: "92",
    name: "Hauts-de-Seine",
    hub: "Boulogne, Nanterre…",
    note: "Première couronne ouest, souvent accessible depuis Paris.",
  },
  {
    code: "93",
    name: "Seine-Saint-Denis",
    hub: "Saint-Denis, Montreuil…",
    note: "Nord-est francilien — qualification d'accès selon le site.",
  },
  {
    code: "94",
    name: "Val-de-Marne",
    hub: "Créteil, Vitry…",
    note: "Sud-est proche — interventions planifiées selon horaires.",
  },
  {
    code: "95",
    name: "Val-d'Oise",
    hub: "Cergy, Argenteuil…",
    note: "Nord IDF — faisabilité confirmée avant proposition.",
  },
  {
    code: "78",
    name: "Yvelines",
    hub: "Versailles, Saint-Germain…",
    note: "Ouest francilien — communes réellement accessibles.",
  },
  {
    code: "91",
    name: "Essonne",
    hub: "Évry, Massy…",
    note: "Sud IDF — limite de secteur à valider au cas par cas.",
  },
  {
    code: "77",
    name: "Seine-et-Marne",
    hub: "Melun, Meaux…",
    note: "Est IDF — couverture au plus près des sites accessibles.",
  },
];

export const IDF_DEPARTMENT_CODES = IDF_DEPARTMENTS.map((d) => d.code);
