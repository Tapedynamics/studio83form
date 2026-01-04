import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";

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

export async function insertSubmission(data: {
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
}): Promise<number> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured");
  }

  const { data: result, error } = await supabase
    .from("submissions")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  return result.id;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getSubmissionById(id: number): Promise<Submission | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase fetch error:", error);
    return null;
  }

  return data;
}

export async function deleteSubmission(id: number): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { error } = await supabaseAdmin
    .from("submissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    return false;
  }

  return true;
}
