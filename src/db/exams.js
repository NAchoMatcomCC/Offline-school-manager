// evaluaciones.js
import { db } from "./db";
import { getEstudianteById } from "./students";
import { getAsignaturaById } from "./grades";

export async function addEvaluacion(data) {
  // data = { id_estudiante, id_asignatura, tipo_evaluacion, nota, fecha_evaluacion }
  return await db.evaluaciones.add(data);
}

export async function getAllEvaluaciones() {
  return await db.evaluaciones.toArray();
}

export async function updateEvaluacion(id, data) {
  return await db.evaluaciones.update(id, data);
}

export async function deleteEvaluacion(id) {
  return await db.evaluaciones.delete(id);
}

// Trae todas las evaluaciones de un estudiante, YA CON el nombre de la asignatura incluido
export async function getEvaluacionesByEstudiante(id_estudiante) {
  const evaluaciones = await db.evaluaciones
    .where("id_estudiante")
    .equals(id_estudiante)
    .toArray();

  const evaluacionesConAsignatura = await Promise.all(
    evaluaciones.map(async (evaluacion) => {
      const asignatura = await getAsignaturaById(evaluacion.id_asignatura);
      return {
        ...evaluacion,
        nombre_asignatura: asignatura?.nombre_asignatura ?? "Asignatura eliminada",
      };
    })
  );

  return evaluacionesConAsignatura;
}

// Trae TODAS las evaluaciones, con nombre de estudiante y asignatura incluidos
// Útil para la tabla general de la vista de Evaluaciones
export async function getEvaluacionesConDetalle() {
  const evaluaciones = await db.evaluaciones.toArray();

  const evaluacionesConDetalle = await Promise.all(
    evaluaciones.map(async (evaluacion) => {
      const [estudiante, asignatura] = await Promise.all([
        getEstudianteById(evaluacion.id_estudiante),
        getAsignaturaById(evaluacion.id_asignatura),
      ]);
      return {
        ...evaluacion,
        nombre_estudiante: estudiante?.nombres_apellidos ?? "Estudiante eliminado",
        nombre_asignatura: asignatura?.nombre_asignatura ?? "Asignatura eliminada",
      };
    })
  );

  return evaluacionesConDetalle;
}