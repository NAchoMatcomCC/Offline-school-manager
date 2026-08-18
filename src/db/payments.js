// pagos.js
import { db } from "./db";
import { getEstudianteById } from "./students";

export async function addPago(data) {
  // data = { id_estudiante, fecha_pago, modalidad, monto, cuotas }
  return await db.pagos.add(data);
}

export async function getAllPagos() {
  return await db.pagos.toArray();
}

export async function updatePago(id, data) {
  return await db.pagos.update(id, data);
}

export async function deletePago(id) {
  return await db.pagos.delete(id);
}

export async function getPagosByEstudiante(id_estudiante) {
  return await db.pagos.where("id_estudiante").equals(id_estudiante).toArray();
}

// Trae todos los pagos con el nombre del estudiante incluido — para la tabla general
export async function getPagosConDetalle() {
  const pagos = await db.pagos.toArray();

  const pagosConDetalle = await Promise.all(
    pagos.map(async (pago) => {
      const estudiante = await getEstudianteById(pago.id_estudiante);
      return {
        ...pago,
        nombre_estudiante: estudiante?.nombres_apellidos ?? "Estudiante eliminado",
      };
    })
  );

  return pagosConDetalle;
}

// Suma total de pagos de un estudiante (útil para el Dashboard o para ver el historial)
export async function getTotalPagadoPorEstudiante(id_estudiante) {
  const pagos = await getPagosByEstudiante(id_estudiante);
  return pagos.reduce((total, pago) => total + pago.monto, 0);
}