// asignaturas.js
import { db } from "./db";

export async function addAsignatura(data) {
  // data = { nombre_asignatura }
  return await db.asignaturas.add(data);
}

export async function getAllAsignaturas() {
  return await db.asignaturas.toArray();
}

export async function getAsignaturaById(id) {
  return await db.asignaturas.get(id);
}

export async function updateAsignatura(id, data) {
  return await db.asignaturas.update(id, data);
}

export async function deleteAsignatura(id) {
  return await db.asignaturas.delete(id);
}