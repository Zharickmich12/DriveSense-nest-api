# DriveSense API

## Descripción del Proyecto

**DriveSense** es una API Backend desarrollada con **NestJS** que implementa un sistema **inteligente de control de pico y placa** para diferentes ciudades.

El objetivo es permitir que tanto usuarios como administradores gestionen y consulten las restricciones vehiculares de forma centralizada, segura y automatizada.

El sistema permite registrar usuarios, ciudades, vehículos y reglas, así como consultar si un vehículo puede circular en una fecha y hora determinada. Además, registra logs automáticos de las consultas y cuenta con autenticación JWT, roles, validaciones, Swagger y MySQL.

---

## Roles de los Integrantes

| Integrante         | Rol / Función                          |
| ------------------ | -------------------------------------- |
| Zharick Fetecua    | Product Owner / Desarrolladora backend |
| Leidy Alvarez      | Scrum Master / Desarrolladora backend  |
| Maria Angel Vargas | Desarrolladora backend                 |
| Eileen Mendoza     | Desarrolladora backend                 |
| Kelly Natalia Toro | Desarrolladora backend                 |

---

## Instrucciones para Ejecutar la API Localmente

1. Clonar el repositorio:

```bash
git clone <https://github.com/Zharickmich12/DriveSense-nest-api.git>
cd <drivesense-nest-api>
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno (.env)

```bash
cp .env.template .env
```

4. Luego editar el archivo con tus credenciales (DB_USER, DB_PASS, JWT_SECRET, etc.)

5. Ejecutar migraciones de la base de datos

```bash
npm run typeorm:migration:run
```

6. Iniciar el servidor en modo desarrollo

```bash
npm run start:dev
```

El backend estará disponible por defecto en:
http://localhost:3000

7. Acceder a la documentación Swagger
   http://localhost:3000/api

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
PORT = 4000
APP_NAME = DriveSense_nest_api
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD =
DB_NAME = drivesensedb
JWT_SECRET_KEY = The_secret_key
JWT_EXPIRES_IN = 1h
```

## Ejemplos de endpoints (rutas principales)
---

### Reglas (Rules)

| Método | Ruta | Descripción | Headers | Body |
|--------|------|-------------|--------|------|
| POST | `/rules` | Crear una nueva regla (solo ADMIN) | `Authorization: Bearer <token>` | `{ "name": "No Circulation", "description": "No circulación los lunes" }` |
| GET | `/rules` | Listar todas las reglas (solo ADMIN) | `Authorization: Bearer <token>` | - |
| GET | `/rules/:id` | Obtener una regla por ID (solo ADMIN) | `Authorization: Bearer <token>` | - |
| PATCH | `/rules/:id` | Actualizar una regla (solo ADMIN) | `Authorization: Bearer <token>` | `{ "description": "Descripción actualizada" }` |
| DELETE | `/rules/:id` | Eliminar una regla (solo ADMIN) | `Authorization: Bearer <token>` | - |
| POST | `/rules/check` | Validar circulación para una placa específica | `Authorization: Bearer <token>` | `{ "plate": "ABC123", "cityId": 1, "date": "2025-11-19" }` |
| POST | `/rules/day` | Consulta de circulación por un día | `Authorization: Bearer <token>` | `{ "plate": "ABC123", "cityId": 1, "date": "2025-11-19" }` |
| POST | `/rules/week` | Consulta de circulación por semana completa | `Authorization: Bearer <token>` | `{ "plate": "ABC123", "cityId": 1 }` |

---

### Ciudades (Cities)

| Método | Ruta | Descripción | Headers | Body |
|--------|------|-------------|--------|------|
| POST | `/cities` | Crear una nueva ciudad (solo ADMIN) | `Authorization: Bearer <token>` | `{ "name": "Bogotá" }` |
| GET | `/cities` | Listar todas las ciudades | `Authorization: Bearer <token>` | - |
| GET | `/cities/:id` | Obtener una ciudad por ID | `Authorization: Bearer <token>` | - |
| PATCH | `/cities/:id` | Actualizar una ciudad (solo ADMIN) | `Authorization: Bearer <token>` | `{ "name": "Medellín" }` |
| DELETE | `/cities/:id` | Eliminar una ciudad (solo ADMIN) | `Authorization: Bearer <token>` | - |

---

### Vehículos (Vehicles)

| Método | Ruta | Descripción | Headers | Body |
|--------|------|-------------|--------|------|
| POST | `/vehicles` | Registrar un vehículo (solo ADMIN) | `Authorization: Bearer <token>` | `{ "plate": "ABC123", "owner": "Juan Pérez", "cityId": 1 }` |
| GET | `/vehicles` | Listar todos los vehículos | `Authorization: Bearer <token>` | - |
| GET | `/vehicles/:id` | Obtener vehículo por ID | `Authorization: Bearer <token>` | - |
| PATCH | `/vehicles/:id` | Actualizar vehículo (solo ADMIN) | `Authorization: Bearer <token>` | `{ "owner": "Carlos López" }` |
| DELETE | `/vehicles/:id` | Eliminar vehículo (solo ADMIN) | `Authorization: Bearer <token>` | - |

---

### Usuarios (Users)

| Método | Ruta | Descripción | Headers | Body |
|--------|------|-------------|--------|------|
| POST | `/users` | Crear un nuevo usuario (solo ADMIN) | `Authorization: Bearer <token>` | `{ "username": "nuevoUsuario", "password": "123456", "role": "USER" }` |
| GET | `/users` | Listar todos los usuarios (solo ADMIN) | `Authorization: Bearer <token>` | - |
| GET | `/users/:id` | Obtener usuario por ID (solo ADMIN) | `Authorization: Bearer <token>` | - |
| PATCH | `/users/:id` | Actualizar usuario (solo ADMIN) | `Authorization: Bearer <token>` | `{ "role": "ADMIN" }` |
| DELETE | `/users/:id` | Eliminar usuario (solo ADMIN) | `Authorization: Bearer <token>` | - |

---

### Autenticación (Auth)

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| POST | `/auth/login` | Iniciar sesión y obtener token JWT | `{ "username": "admin", "password": "admin123" }` |
| POST | `/auth/register` | Registrar un nuevo usuario (solo ADMIN) | `{ "username": "nuevoUsuario", "password": "123456", "role": "USER" }` |

---

### Nota importante
- Todos los endpoints de `rules`, `cities`, `vehicles` y `users` requieren **autenticación**.   

## Pruebas Unitarias y Evidencias