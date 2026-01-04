"use client";

import { useState } from "react";

interface FormData {
  nombre: string;
  edad: string;
  formacion: string;
  tiempoTrabajo: string;
  areas: string[];
  objetivo: string;
  modalidad: string;
  periodo: string;
  fechaConcreta: string;
  formato: string;
  objetivoProfesional: string[];
}

export default function FormCurso() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    edad: "",
    formacion: "",
    tiempoTrabajo: "",
    areas: [],
    objetivo: "",
    modalidad: "",
    periodo: "",
    fechaConcreta: "",
    formato: "",
    objetivoProfesional: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleCheckboxChange = (field: "areas" | "objetivoProfesional", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al enviar");

      setIsSubmitted(true);
    } catch {
      setError("Hubo un error al enviar el formulario. Por favor, intentalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="section-card">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl font-bold mb-4 text-[--primary]">Gracias por tu tiempo</h1>
          <p className="text-lg text-[--text-muted] mb-6">
            Con esta informacion podremos crear una propuesta formativa{" "}
            <strong className="text-[--foreground]">hecha a medida para ti</strong>.
          </p>
          <p className="text-[--text-muted]">
            Nos pondremos en contacto contigo muy pronto.
          </p>
          <a
            href="https://wa.me/34634011846"
            className="btn-primary mt-8 inline-flex"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Ficha de Conocimiento
        </h1>
        <p className="text-xl text-[--secondary] font-[family-name:var(--font-sans)] font-semibold">
          Curso Avanzado Studio83
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Seccion 1: Datos generales */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">1</span>
            Datos generales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 font-[family-name:var(--font-sans)]">
                Nombre y apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 font-[family-name:var(--font-sans)]">
                Edad <span className="text-[--text-muted]">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                placeholder="Tu edad"
              />
            </div>
          </div>
        </div>

        {/* Seccion 2: Formacion y experiencia */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">2</span>
            Formacion y experiencia
          </h2>
          <div className="space-y-3">
            {[
              { value: "ninguna", label: "No tengo formacion previa" },
              { value: "basica", label: "Formacion basica" },
              { value: "avanzada", label: "Formacion avanzada" },
              { value: "trabajo", label: "Trabajo ya en el sector" },
            ].map((option) => (
              <label key={option.value} className="checkbox-custom">
                <input
                  type="radio"
                  name="formacion"
                  value={option.value}
                  checked={formData.formacion === option.value}
                  onChange={(e) => setFormData({ ...formData, formacion: e.target.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {formData.formacion === "trabajo" && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 font-[family-name:var(--font-sans)]">
                ¿Desde hace cuanto tiempo trabajas en el sector?
              </label>
              <input
                type="text"
                value={formData.tiempoTrabajo}
                onChange={(e) => setFormData({ ...formData, tiempoTrabajo: e.target.value })}
                placeholder="Ej: 2 años, 6 meses..."
              />
            </div>
          )}
        </div>

        {/* Seccion 3: Areas de interes */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">3</span>
            ¿En que area te gustaria enfocarte principalmente?
          </h2>
          <p className="text-sm text-[--text-muted] mb-4">Puedes marcar mas de una opcion</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Tecnicas de masaje",
              "Tratamientos corporales",
              "Tratamientos faciales",
              "Bienestar y relajacion",
              "Recuperacion deportiva",
              "Mejora de la tecnica y seguridad manual",
            ].map((area) => (
              <label key={area} className="checkbox-custom">
                <input
                  type="checkbox"
                  checked={formData.areas.includes(area)}
                  onChange={() => handleCheckboxChange("areas", area)}
                />
                <span>{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Seccion 4: Objetivo del curso */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">4</span>
            Objetivo principal del curso
          </h2>
          <label className="block text-sm font-medium mb-2 font-[family-name:var(--font-sans)]">
            ¿Que te gustaria conseguir con esta formacion?
          </label>
          <p className="text-sm text-[--text-muted] mb-3">
            Ejemplo: mejorar resultados con los clientes, aprender nuevas tecnicas, especializarte, sentirte mas segura/o, ampliar servicios, etc.
          </p>
          <textarea
            rows={4}
            value={formData.objetivo}
            onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
            placeholder="Escribe tu objetivo..."
          />
        </div>

        {/* Seccion 5: Modalidad */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">5</span>
            Modalidad preferida
          </h2>
          <div className="space-y-3">
            {[
              { value: "individual", label: "Curso individual (100% personalizado)" },
              { value: "grupo", label: "Curso en grupo reducido (segun disponibilidad)" },
            ].map((option) => (
              <label key={option.value} className="checkbox-custom">
                <input
                  type="radio"
                  name="modalidad"
                  value={option.value}
                  checked={formData.modalidad === option.value}
                  onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Seccion 6: Disponibilidad */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">6</span>
            Disponibilidad
          </h2>

          <div className="mb-6">
            <p className="text-sm font-medium mb-3 font-[family-name:var(--font-sans)]">
              Periodo en el que te gustaria realizar el curso:
            </p>
            <div className="space-y-3">
              <label className="checkbox-custom">
                <input
                  type="radio"
                  name="periodo"
                  value="proximamente"
                  checked={formData.periodo === "proximamente"}
                  onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                />
                <span>Proximamente</span>
              </label>
              <label className="checkbox-custom">
                <input
                  type="radio"
                  name="periodo"
                  value="fecha_concreta"
                  checked={formData.periodo === "fecha_concreta"}
                  onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                />
                <span>En una fecha concreta</span>
              </label>
            </div>
            {formData.periodo === "fecha_concreta" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.fechaConcreta}
                  onChange={(e) => setFormData({ ...formData, fechaConcreta: e.target.value })}
                  placeholder="Indica la fecha o periodo preferido"
                />
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-3 font-[family-name:var(--font-sans)]">
              Preferencia de formato:
            </p>
            <div className="space-y-3">
              {[
                { value: "intensivo", label: "Intensivo" },
                { value: "distribuido", label: "Distribuido en varios dias" },
              ].map((option) => (
                <label key={option.value} className="checkbox-custom">
                  <input
                    type="radio"
                    name="formato"
                    value={option.value}
                    checked={formData.formato === option.value}
                    onChange={(e) => setFormData({ ...formData, formato: e.target.value })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Seccion 7: Objetivo profesional */}
        <div className="section-card">
          <h2 className="section-title">
            <span className="section-number">7</span>
            Tu objetivo profesional
          </h2>
          <p className="text-sm text-[--text-muted] mb-4">
            Este curso es importante para ti porque quieres: (puedes marcar varias)
          </p>
          <div className="space-y-3">
            {[
              "Mejorar la calidad de tus tratamientos",
              "Aumentar tus conocimientos",
              "Diferenciarte profesionalmente",
              "Ampliar tus servicios",
              "Crecer a nivel personal y profesional",
            ].map((obj) => (
              <label key={obj} className="checkbox-custom">
                <input
                  type="checkbox"
                  checked={formData.objetivoProfesional.includes(obj)}
                  onChange={() => handleCheckboxChange("objetivoProfesional", obj)}
                />
                <span>{obj}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-lg px-10 py-4"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar formulario"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
