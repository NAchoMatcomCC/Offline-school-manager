import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { addEstudiante, getAllEstudiantes, deleteEstudiante } from "./db/students";
import { addAsignatura, getAllAsignaturas, deleteAsignatura } from "./db/grades";
import { addEvaluacion, deleteEvaluacion, getEvaluacionesConDetalle } from "./db/exams";
import { addPago, deletePago, getPagosConDetalle } from "./db/payments";
import "./App.css";

const TABS = ["Estudiantes", "Asignaturas", "Evaluaciones", "Pagos"];

function App() {
  const [tab, setTab] = useState("Estudiantes");

  return (
    <div className="App">
      <header className="app-header">
        <h1>Repaso · Profe Liset</h1>
        <p>Base de datos local (offline)</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === "Estudiantes" && <EstudiantesTab />}
        {tab === "Asignaturas" && <AsignaturasTab />}
        {tab === "Evaluaciones" && <EvaluacionesTab />}
        {tab === "Pagos" && <PagosTab />}
      </main>
    </div>
  );
}

/* ---------- Estudiantes ---------- */

function EstudiantesTab() {
  const estudiantes = useLiveQuery(() => getAllEstudiantes(), []);

  const [form, setForm] = useState({
    nombres_apellidos: "",
    direccion_particular: "",
    telefono_celular: "",
    fecha_nacimiento: "",
    grado: "",
    grupo: "",
  });

  const set = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombres_apellidos.trim()) return;
    await addEstudiante(form);
    setForm({
      nombres_apellidos: "",
      direccion_particular: "",
      telefono_celular: "",
      fecha_nacimiento: "",
      grado: "",
      grupo: "",
    });
  }

  return (
    <section className="panel">
      <h2>Agregar estudiante</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input placeholder="Nombres y apellidos *" value={form.nombres_apellidos} onChange={set("nombres_apellidos")} />
        <input placeholder="Dirección particular" value={form.direccion_particular} onChange={set("direccion_particular")} />
        <input placeholder="Teléfono celular" value={form.telefono_celular} onChange={set("telefono_celular")} />
        <label>
          Fecha de nacimiento
          <input type="date" value={form.fecha_nacimiento} onChange={set("fecha_nacimiento")} />
        </label>
        <input placeholder="Grado" value={form.grado} onChange={set("grado")} />
        <input placeholder="Grupo" value={form.grupo} onChange={set("grupo")} />
        <button type="submit" className="btn-primary">Guardar estudiante</button>
      </form>

      <h2>Lista de estudiantes ({estudiantes?.length ?? 0})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombres</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Nacimiento</th>
              <th>Grado</th>
              <th>Grupo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {estudiantes?.map((est) => (
              <tr key={est.id_estudiante}>
                <td>{est.id_estudiante}</td>
                <td>{est.nombres_apellidos}</td>
                <td>{est.direccion_particular}</td>
                <td>{est.telefono_celular}</td>
                <td>{est.fecha_nacimiento}</td>
                <td>{est.grado}</td>
                <td>{est.grupo}</td>
                <td>
                  <button className="btn-danger" onClick={() => deleteEstudiante(est.id_estudiante)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!estudiantes?.length && <p className="empty">No hay estudiantes registrados.</p>}
      </div>
    </section>
  );
}

/* ---------- Asignaturas ---------- */

function AsignaturasTab() {
  const asignaturas = useLiveQuery(() => getAllAsignaturas(), []);
  const [nombre, setNombre] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    await addAsignatura({ nombre_asignatura: nombre.trim() });
    setNombre("");
  }

  return (
    <section className="panel">
      <h2>Agregar asignatura</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input placeholder="Nombre de la asignatura *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <button type="submit" className="btn-primary">Guardar asignatura</button>
      </form>

      <h2>Lista de asignaturas ({asignaturas?.length ?? 0})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {asignaturas?.map((asig) => (
              <tr key={asig.id_asignatura}>
                <td>{asig.id_asignatura}</td>
                <td>{asig.nombre_asignatura}</td>
                <td>
                  <button className="btn-danger" onClick={() => deleteAsignatura(asig.id_asignatura)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!asignaturas?.length && <p className="empty">No hay asignaturas registradas.</p>}
      </div>
    </section>
  );
}

/* ---------- Evaluaciones ---------- */

function EvaluacionesTab() {
  const evaluaciones = useLiveQuery(() => getEvaluacionesConDetalle(), []);
  const estudiantes = useLiveQuery(() => getAllEstudiantes(), []);
  const asignaturas = useLiveQuery(() => getAllAsignaturas(), []);

  const [form, setForm] = useState({
    id_estudiante: "",
    id_asignatura: "",
    tipo_evaluacion: "",
    nota: "",
    fecha_evaluacion: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.id_estudiante || !form.id_asignatura || form.nota === "") return;
    await addEvaluacion({
      id_estudiante: Number(form.id_estudiante),
      id_asignatura: Number(form.id_asignatura),
      tipo_evaluacion: form.tipo_evaluacion,
      nota: Number(form.nota),
      fecha_evaluacion: form.fecha_evaluacion,
    });
    setForm({ id_estudiante: "", id_asignatura: "", tipo_evaluacion: "", nota: "", fecha_evaluacion: "" });
  }

  return (
    <section className="panel">
      <h2>Agregar evaluación</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <select value={form.id_estudiante} onChange={set("id_estudiante")}>
          <option value="">Estudiante *</option>
          {estudiantes?.map((est) => (
            <option key={est.id_estudiante} value={est.id_estudiante}>{est.nombres_apellidos}</option>
          ))}
        </select>
        <select value={form.id_asignatura} onChange={set("id_asignatura")}>
          <option value="">Asignatura *</option>
          {asignaturas?.map((asig) => (
            <option key={asig.id_asignatura} value={asig.id_asignatura}>{asig.nombre_asignatura}</option>
          ))}
        </select>
        <input placeholder="Tipo (Parcial, Final, Taller…)" value={form.tipo_evaluacion} onChange={set("tipo_evaluacion")} />
        <input type="number" step="0.1" min="0" max="5" placeholder="Nota *" value={form.nota} onChange={set("nota")} />
        <label>
          Fecha de evaluación
          <input type="date" value={form.fecha_evaluacion} onChange={set("fecha_evaluacion")} />
        </label>
        <button type="submit" className="btn-primary">Guardar evaluación</button>
      </form>

      <h2>Lista de evaluaciones ({evaluaciones?.length ?? 0})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Asignatura</th>
              <th>Tipo</th>
              <th>Nota</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones?.map((ev) => (
              <tr key={ev.id_evaluacion}>
                <td>{ev.id_evaluacion}</td>
                <td>{ev.nombre_estudiante}</td>
                <td>{ev.nombre_asignatura}</td>
                <td>{ev.tipo_evaluacion}</td>
                <td>{ev.nota}</td>
                <td>{ev.fecha_evaluacion}</td>
                <td>
                  <button className="btn-danger" onClick={() => deleteEvaluacion(ev.id_evaluacion)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!evaluaciones?.length && <p className="empty">No hay evaluaciones registradas.</p>}
      </div>
    </section>
  );
}

/* ---------- Pagos ---------- */

function PagosTab() {
  const pagos = useLiveQuery(() => getPagosConDetalle(), []);
  const estudiantes = useLiveQuery(() => getAllEstudiantes(), []);

  const [form, setForm] = useState({
    id_estudiante: "",
    fecha_pago: "",
    modalidad: "",
    monto: "",
    cuotas: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.id_estudiante || form.monto === "") return;
    await addPago({
      id_estudiante: Number(form.id_estudiante),
      fecha_pago: form.fecha_pago,
      modalidad: form.modalidad,
      monto: Number(form.monto),
      cuotas: form.cuotas ? Number(form.cuotas) : 1,
    });
    setForm({ id_estudiante: "", fecha_pago: "", modalidad: "", monto: "", cuotas: "" });
  }

  const total = (pagos ?? []).reduce((sum, p) => sum + p.monto, 0);

  return (
    <section className="panel">
      <h2>Agregar pago</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <select value={form.id_estudiante} onChange={set("id_estudiante")}>
          <option value="">Estudiante *</option>
          {estudiantes?.map((est) => (
            <option key={est.id_estudiante} value={est.id_estudiante}>{est.nombres_apellidos}</option>
          ))}
        </select>
        <label>
          Fecha de pago
          <input type="date" value={form.fecha_pago} onChange={set("fecha_pago")} />
        </label>
        <input placeholder="Modalidad (Efectivo, Transferencia…)" value={form.modalidad} onChange={set("modalidad")} />
        <input type="number" step="0.01" min="0" placeholder="Monto *" value={form.monto} onChange={set("monto")} />
        <input type="number" min="1" placeholder="Cuotas" value={form.cuotas} onChange={set("cuotas")} />
        <button type="submit" className="btn-primary">Guardar pago</button>
      </form>

      <h2>Lista de pagos ({pagos?.length ?? 0}) · Total: ${total.toFixed(2)}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Fecha</th>
              <th>Modalidad</th>
              <th>Monto</th>
              <th>Cuotas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagos?.map((pago) => (
              <tr key={pago.id_pago}>
                <td>{pago.id_pago}</td>
                <td>{pago.nombre_estudiante}</td>
                <td>{pago.fecha_pago}</td>
                <td>{pago.modalidad}</td>
                <td>${Number(pago.monto).toFixed(2)}</td>
                <td>{pago.cuotas}</td>
                <td>
                  <button className="btn-danger" onClick={() => deletePago(pago.id_pago)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pagos?.length && <p className="empty">No hay pagos registrados.</p>}
      </div>
    </section>
  );
}

export default App;
