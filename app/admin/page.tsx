"use client";

import { useState, useEffect } from "react";

interface Submission {
  id: number;
  nombre: string;
  edad: string | null;
  formacion: string | null;
  tiempo_trabajo: string | null;
  areas: string | null;
  objetivo: string | null;
  modalidad: string | null;
  periodo: string | null;
  fecha_concreta: string | null;
  formato: string | null;
  objetivo_profesional: string | null;
  created_at: string;
}

const formacionLabels: Record<string, string> = {
  ninguna: "Sin formacion previa",
  basica: "Formacion basica",
  avanzada: "Formacion avanzada",
  trabajo: "Trabaja en el sector",
};

const modalidadLabels: Record<string, string> = {
  individual: "Curso individual",
  grupo: "Curso en grupo",
};

const periodoLabels: Record<string, string> = {
  proximamente: "Proximamente",
  fecha_concreta: "Fecha concreta",
};

const formatoLabels: Record<string, string> = {
  intensivo: "Intensivo",
  distribuido: "Distribuido",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/submissions?key=${password}`);
      if (res.ok) {
        setIsAuthenticated(true);
        const data = await res.json();
        setSubmissions(data.submissions);
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions?key=${password}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm("¿Estas seguro de eliminar este registro?")) return;

    try {
      const res = await fetch(`/api/submissions?key=${password}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch {
      alert("Error al eliminar");
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Fecha",
      "Nombre",
      "Edad",
      "Formacion",
      "Tiempo trabajo",
      "Areas",
      "Objetivo",
      "Modalidad",
      "Periodo",
      "Fecha concreta",
      "Formato",
      "Objetivo profesional",
    ];

    const rows = submissions.map((s) => [
      s.id,
      new Date(s.created_at).toLocaleString("es-ES"),
      s.nombre,
      s.edad || "",
      formacionLabels[s.formacion || ""] || s.formacion || "",
      s.tiempo_trabajo || "",
      s.areas ? JSON.parse(s.areas).join(", ") : "",
      s.objetivo || "",
      modalidadLabels[s.modalidad || ""] || s.modalidad || "",
      periodoLabels[s.periodo || ""] || s.periodo || "",
      s.fecha_concreta || "",
      formatoLabels[s.formato || ""] || s.formato || "",
      s.objetivo_profesional ? JSON.parse(s.objetivo_profesional).join(", ") : "",
    ]);

    const csvContent =
      [headers.join(";"), ...rows.map((r) => r.map((c) => `"${c}"`).join(";"))].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscripciones-curso-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const parseArray = (str: string | null): string[] => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16">
        <div className="section-card">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
          <form onSubmit={authenticate}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 font-[family-name:var(--font-sans)]">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduce la contraseña"
                className="w-full"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Verificando..." : "Acceder"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inscripciones al Curso</h1>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 border border-[--border] rounded-lg hover:bg-[--accent] transition-colors font-[family-name:var(--font-sans)] text-sm"
          >
            {loading ? "..." : "Actualizar"}
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-[--secondary] text-white rounded-lg hover:opacity-90 transition-opacity font-[family-name:var(--font-sans)] text-sm"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lista de inscripciones */}
        <div className="section-card max-h-[70vh] overflow-y-auto">
          <h2 className="section-title sticky top-0 bg-white z-10">
            <span className="section-number">{submissions.length}</span>
            Registros
          </h2>

          {submissions.length === 0 ? (
            <p className="text-[--text-muted] text-center py-8">
              No hay inscripciones todavia
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSubmission(s)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSubmission?.id === s.id
                      ? "border-[--primary] bg-[--accent-light]"
                      : "border-[--border] hover:border-[--primary] hover:bg-[--accent-light]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold font-[family-name:var(--font-sans)]">
                        {s.nombre}
                      </p>
                      <p className="text-sm text-[--text-muted]">
                        {new Date(s.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {s.formacion && (
                        <span className="text-xs px-2 py-1 bg-[--accent] rounded-full">
                          {formacionLabels[s.formacion] || s.formacion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalle */}
        <div className="section-card">
          {selectedSubmission ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="section-title mb-0 pb-0 border-0">
                  Detalle
                </h2>
                <button
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-[family-name:var(--font-sans)]"
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Nombre</p>
                  <p className="font-medium">{selectedSubmission.nombre}</p>
                </div>

                {selectedSubmission.edad && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Edad</p>
                    <p>{selectedSubmission.edad}</p>
                  </div>
                )}

                {selectedSubmission.formacion && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Formacion</p>
                    <p>{formacionLabels[selectedSubmission.formacion] || selectedSubmission.formacion}</p>
                    {selectedSubmission.tiempo_trabajo && (
                      <p className="text-sm mt-1">Experiencia: {selectedSubmission.tiempo_trabajo}</p>
                    )}
                  </div>
                )}

                {selectedSubmission.areas && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Areas de interes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {parseArray(selectedSubmission.areas).map((area, i) => (
                        <span key={i} className="text-sm px-2 py-1 bg-[--sage] text-white rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.objetivo && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Objetivo del curso</p>
                    <p className="bg-[--accent-light] p-3 rounded-lg mt-1">{selectedSubmission.objetivo}</p>
                  </div>
                )}

                {selectedSubmission.modalidad && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Modalidad</p>
                    <p>{modalidadLabels[selectedSubmission.modalidad] || selectedSubmission.modalidad}</p>
                  </div>
                )}

                {selectedSubmission.periodo && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Disponibilidad</p>
                    <p>
                      {periodoLabels[selectedSubmission.periodo] || selectedSubmission.periodo}
                      {selectedSubmission.fecha_concreta && `: ${selectedSubmission.fecha_concreta}`}
                    </p>
                    {selectedSubmission.formato && (
                      <p className="text-sm mt-1">
                        Formato: {formatoLabels[selectedSubmission.formato] || selectedSubmission.formato}
                      </p>
                    )}
                  </div>
                )}

                {selectedSubmission.objetivo_profesional && (
                  <div>
                    <p className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">Objetivos profesionales</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {parseArray(selectedSubmission.objetivo_profesional).map((obj, i) => (
                        <li key={i} className="text-sm">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-[--border]">
                  <p className="text-xs text-[--text-muted]">
                    Registrado: {new Date(selectedSubmission.created_at).toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-[--text-muted]">
              <p>Selecciona un registro para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
