# Offline School Manager

A school management web app that works fully offline. It manages students, evaluations (grades), and payments, with all data persisted locally in the browser using **IndexedDB** through **Dexie.js** — no backend or internet connection required.

> **Status:** Work in progress. Core CRUD functionality for students, evaluations, and payments is being implemented as an MVP. See [Roadmap](#roadmap) below for the full planned data model.

## Why offline-first?

This project was built to solve a real need: small tutoring/review schools often don't have reliable internet access, but still need to track student records, grades, and payments digitally. Instead of relying on a server, all data is stored directly in the browser using IndexedDB, so the app keeps working with no connection at all.

## Tech stack

- **React** — UI
- **Dexie.js** — a wrapper over IndexedDB, used for local, structured, relational-style data persistence
- **Vite** — build tool

## Why IndexedDB (and not SQLite or localStorage)?

- `localStorage` only stores simple key-value strings — not suitable for structured, relational data like students, grades, and payments.
- SQLite in the browser (via WebAssembly, e.g. sql.js) doesn't persist data on its own — it still needs IndexedDB underneath to save permanently, adding unnecessary complexity for this use case.
- IndexedDB is the native browser technology for offline storage. Dexie.js wraps it in a clean, promise-based API.

## Data model (MVP)

| Entity | Fields |
|---|---|
| **Students** | id, full name, address, phone, birth date, grade, group |
| **Subjects** | id, name |
| **Evaluations** | id, student (FK), subject (FK), evaluation type, score, date |
| **Payments** | id, student (FK), date, payment method, amount, installments |

Relations between tables (e.g. evaluations belonging to a student) are resolved in application code, since IndexedDB has no built-in JOIN support.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Roadmap

This MVP is a deliberately scoped-down version of a larger data model originally designed for a real tutoring school, covering 14 entities in total (schools, parents/tutors with a many-to-many relationship, attendance tracking, class schedules, parent meetings, internal regulations, and services). Those are documented as future scope but not yet implemented, in order to ship a focused, working MVP first.

Planned next steps:
- [ ] Dashboard with summary stats (total students, pending payments, upcoming exams)
- [ ] Attendance tracking
- [ ] Parent/tutor records (many-to-many relationship with students)
- [ ] Basic reporting

## License

MIT
