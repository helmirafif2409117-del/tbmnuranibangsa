// Lightweight CSV utilities + Dublin Core / MARC 21 autodetect for books.

export type BookRow = {
  title: string;
  creator: string | null;
  contributor: string | null;
  subject: string[];
  publisher: string | null;
  series: string | null;
  language: string | null;
  type: string | null;
  identifier: string | null;
  description: string | null;
  coverage: string | null;
  marc_record: string | null;
  cover_url: string | null;
};

// ---------- CSV parse / stringify (RFC 4180-ish) ----------
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  text = text.replace(/^\uFEFF/, "");
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { cur.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function csvEscape(v: string) {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function toCsv(books: BookRow[]): string {
  const headers = [
    "title","creator","contributor","subject","publisher","series",
    "language","type","identifier","description","coverage","marc_record","cover_url",
  ];
  const lines = [headers.join(",")];
  for (const b of books) {
    lines.push([
      b.title, b.creator ?? "", b.contributor ?? "", (b.subject ?? []).join("; "),
      b.publisher ?? "", b.series ?? "", b.language ?? "", b.type ?? "",
      b.identifier ?? "", b.description ?? "", b.coverage ?? "",
      b.marc_record ?? "", b.cover_url ?? "",
    ].map((v) => csvEscape(String(v))).join(","));
  }
  return lines.join("\n");
}

// ---------- Format autodetect ----------
export type DetectedFormat = "marc" | "dublin-core" | "unknown";

export function detectFormat(headers: string[]): DetectedFormat {
  const h = headers.map((s) => s.trim().toLowerCase());
  // MARC: header looks like numeric tags (245, 100, 260, ...) or LDR
  const marcHits = h.filter((x) => /^(ldr|\d{3})(\$[a-z0-9])?$/.test(x)).length;
  if (marcHits >= 2) return "marc";
  // Dublin Core elements
  const dc = new Set([
    "title","creator","contributor","subject","publisher","series",
    "language","type","identifier","description","coverage","format","rights","date","source","relation",
  ]);
  const dcHits = h.filter((x) => dc.has(x)).length;
  if (dcHits >= 2) return "dublin-core";
  return "unknown";
}

// ---------- Row -> Book mapping ----------
function pick(o: Record<string, string>, ...keys: string[]) {
  for (const k of keys) {
    const v = o[k.toLowerCase()];
    if (v && v.trim()) return v.trim();
  }
  return "";
}

export function rowsToBooks(rows: string[][]): { books: BookRow[]; format: DetectedFormat } {
  if (rows.length === 0) return { books: [], format: "unknown" };
  const headers = rows[0].map((h) => h.trim());
  const format = detectFormat(headers);
  const data = rows.slice(1);
  const lc = headers.map((h) => h.toLowerCase());

  const books: BookRow[] = data.map((r) => {
    const o: Record<string, string> = {};
    lc.forEach((h, i) => (o[h] = r[i] ?? ""));

    if (format === "marc") {
      // MARC mapping
      const title = pick(o, "245$a", "245", "title");
      const creator = pick(o, "100$a", "100", "creator", "author");
      const contributor = pick(o, "700$a", "700", "contributor");
      const publisher = pick(o, "260$b", "260", "publisher");
      const place = pick(o, "260$a");
      const date = pick(o, "260$c");
      const series = pick(o, "490$a", "830$a", "series");
      const identifier = pick(o, "082$a", "020$a", "identifier");
      const description = pick(o, "520$a", "500$a", "description");
      const language = pick(o, "008", "041$a", "language") || "ind";
      const subject = pick(o, "650$a", "subject").split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      const marcRecord = buildMarcFromRow(o);
      return {
        title, creator: creator || null, contributor: contributor || null,
        subject, publisher: [place, publisher].filter(Boolean).join(" : ") || null,
        series: series || null, language, type: "Text",
        identifier: identifier || null, description: description || null,
        coverage: pick(o, "651$a", "coverage") || null,
        marc_record: marcRecord || null, cover_url: pick(o, "cover_url", "cover") || null,
      };
    }

    // Dublin Core (or unknown but with named columns)
    return {
      title: pick(o, "title"),
      creator: pick(o, "creator", "author") || null,
      contributor: pick(o, "contributor") || null,
      subject: pick(o, "subject", "subjects", "topics").split(/;|,/).map((s) => s.trim()).filter(Boolean),
      publisher: pick(o, "publisher") || null,
      series: pick(o, "series") || null,
      language: pick(o, "language") || "ind",
      type: pick(o, "type") || "Text",
      identifier: pick(o, "identifier", "isbn", "call_number") || null,
      description: pick(o, "description", "abstract") || null,
      coverage: pick(o, "coverage") || null,
      marc_record: pick(o, "marc_record", "marc") || null,
      cover_url: pick(o, "cover_url", "cover", "image") || null,
    };
  }).filter((b) => b.title);

  return { books, format };
}

function buildMarcFromRow(o: Record<string, string>): string {
  const lines: string[] = [];
  if (o["ldr"]) lines.push(`LDR ${o["ldr"]}`);
  const tags = Object.keys(o).filter((k) => /^\d{3}/.test(k)).sort();
  const seen = new Set<string>();
  for (const k of tags) {
    const tag = k.slice(0, 3);
    if (seen.has(tag)) continue;
    seen.add(tag);
    const parts: string[] = [];
    for (const k2 of tags.filter((x) => x.startsWith(tag))) {
      const sub = k2.slice(3); // "" or "$a"
      const v = o[k2];
      if (!v) continue;
      parts.push(sub ? `${sub} ${v}` : v);
    }
    if (parts.length) lines.push(`${tag}    ${parts.join(" ")}`);
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
