# Expense Tracker API

API REST para el seguimiento de gastos personales. Los usuarios se registran, inician sesión con JWT y gestionan sus propios gastos con filtros opcionales por fecha.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)

---

## Requisitos

- Node.js v18+
- PostgreSQL corriendo localmente

---

## Instalación

```bash
git clone https://github.com/dsMxguel/expense-tracker-api.git
cd expense-tracker-api
npm install
```

Copia el archivo de variables de entorno y completa los valores:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/expense_tracker"
JWT_SECRET="tu_secreto_aqui"
PORT=3000
```

Ejecuta la migración de base de datos:

```bash
npx prisma migrate dev
```

Inicia el servidor:

```bash
npm run dev
```

---

## Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear una cuenta nueva |
| POST | `/api/auth/login` | Iniciar sesión y obtener un JWT |

### Gastos

Todas las rutas de gastos requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/expenses` | Listar tus gastos |
| POST | `/api/expenses` | Agregar un nuevo gasto |
| PUT | `/api/expenses/:id` | Actualizar un gasto existente |
| DELETE | `/api/expenses/:id` | Eliminar un gasto |

#### Filtros para GET /api/expenses

| Query param | Valor | Notas |
|-------------|-------|-------|
| `filter` | `last_week` / `last_month` / `last_3_months` / `custom` | Opcional |
| `startDate` | Fecha ISO 8601 | Requerido si `filter=custom` |
| `endDate` | Fecha ISO 8601 | Requerido si `filter=custom` |

---

## Ejemplos de uso

**Registro**
```json
POST /api/auth/register
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Crear gasto**
```json
POST /api/expenses
Authorization: Bearer <token>

{
  "amount": 25.50,
  "category": "Comestibles",
  "description": "Compras del super",
  "date": "2026-06-16T12:00:00.000Z"
}
```

Categorías disponibles: `Comestibles`, `Ocio`, `Electronica`, `Utilidades`, `Ropa`, `Salud`, `Otros`

---

## Formato de respuesta

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Mensaje descriptivo" }
```

---

## Estructura del proyecto

```
src/
├── index.js
├── routes/
├── controllers/
├── services/
├── middleware/
└── validators/
prisma/
└── schema.prisma
```

Flujo de request: `Ruta → Middleware (JWT) → Validador (Zod) → Controlador → Servicio → Prisma → PostgreSQL`

Inspirado de : https://roadmap.sh/projects/expense-tracker-api
