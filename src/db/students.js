// estudiantes.js
import { db } from "./db";

export async function addEstudiante(data) {
  // data = { nombres_apellidos, direccion_particular, telefono_celular, fecha_nacimiento, grado, grupo }
  return await db.estudiantes.add(data);
}

export async function getAllEstudiantes() {
  return await db.estudiantes.toArray();
}

export async function getEstudianteById(id) {
  return await db.estudiantes.get(id);
}

export async function updateEstudiante(id, data) {
  return await db.estudiantes.update(id, data);
}

export async function deleteEstudiante(id) {
  return await db.estudiantes.delete(id);
}