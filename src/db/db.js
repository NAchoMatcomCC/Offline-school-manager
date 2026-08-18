import Dexie from "dexie";

export const db = new Dexie("RepasoProfeLiset");

db.version(1).stores({
  estudiantes: "++id_estudiante, nombres_apellidos, grado, grupo",
  asignaturas: "++id_asignatura, nombre_asignatura",
  evaluaciones: "++id_evaluacion, id_estudiante, id_asignatura, fecha_evaluacion",
  pagos: "++id_pago, id_estudiante, fecha_pago"
});