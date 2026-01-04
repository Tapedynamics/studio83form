import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "submissions.json");

export interface Submission {
  id: number;
  nombre: string;
  edad: string | null;
  formacion: string | null;
  tiempo_trabajo: string | null;
  areas: string[] | null;
  objetivo: string | null;
  modalidad: string | null;
  periodo: string | null;
  fecha_concreta: string | null;
  formato: string | null;
  objetivo_profesional: string[] | null;
  created_at: string;
}

interface Database {
  submissions: Submission[];
  nextId: number;
}

function ensureDataDir(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readDb(): Database {
  ensureDataDir();
  if (!fs.existsSync(dbPath)) {
    return { submissions: [], nextId: 1 };
  }
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { submissions: [], nextId: 1 };
  }
}

function writeDb(db: Database): void {
  ensureDataDir();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function insertSubmission(data: {
  nombre: string;
  edad?: string;
  formacion?: string;
  tiempoTrabajo?: string;
  areas?: string[];
  objetivo?: string;
  modalidad?: string;
  periodo?: string;
  fechaConcreta?: string;
  formato?: string;
  objetivoProfesional?: string[];
}): number {
  const db = readDb();

  const submission: Submission = {
    id: db.nextId,
    nombre: data.nombre,
    edad: data.edad || null,
    formacion: data.formacion || null,
    tiempo_trabajo: data.tiempoTrabajo || null,
    areas: data.areas || null,
    objetivo: data.objetivo || null,
    modalidad: data.modalidad || null,
    periodo: data.periodo || null,
    fecha_concreta: data.fechaConcreta || null,
    formato: data.formato || null,
    objetivo_profesional: data.objetivoProfesional || null,
    created_at: new Date().toISOString(),
  };

  db.submissions.push(submission);
  db.nextId++;
  writeDb(db);

  return submission.id;
}

export function getAllSubmissions(): Submission[] {
  const db = readDb();
  return db.submissions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getSubmissionById(id: number): Submission | undefined {
  const db = readDb();
  return db.submissions.find((s) => s.id === id);
}

export function deleteSubmission(id: number): boolean {
  const db = readDb();
  const index = db.submissions.findIndex((s) => s.id === id);
  if (index === -1) return false;
  db.submissions.splice(index, 1);
  writeDb(db);
  return true;
}
