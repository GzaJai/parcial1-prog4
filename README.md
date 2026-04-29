# Sistema de Gestión de Inventario Gastronómico
## Proyecto Integrador - Programación IV (UTN)

Este proyecto es una aplicación Fullstack desarrollada para el primer parcial de la materia Programación IV. Consiste en un sistema de gestión para locales gastronómicos que permite administrar Categorías, Productos e Ingredientes, integrando relaciones complejas y persistencia de datos real.

### Stack Tecnológico

**Backend:**
* **FastAPI:** Framework web de alto rendimiento.
* **SQLModel:** ORM para la interacción con la base de datos (basado en SQLAlchemy y Pydantic).
* **PostgreSQL:** Base de datos relacional para persistencia de datos.

**Frontend:**
* **React + TypeScript:** Biblioteca para la interfaz de usuario con tipado estricto.
* **Vite:** Herramienta de construcción rápida para el frontend.
* **TanStack Query (React Query):** Gestión de estado del servidor y sincronización.
* **Tailwind CSS 4:** Framework de estilos utility-first para un diseño moderno y responsive.
* **React Router Dom:** Gestión de rutas dinámicas.

### Características Principales

* **CRUD Completo:** Gestión de Categorías, Productos e Ingredientes.
* **Relaciones N:N:** Vinculación de productos con múltiples categorías e ingredientes.
* **Gestión de Imágenes:** Sistema de subida y previsualización de imágenes para productos y categorías.
* **Sincronización Automática:** Uso de `invalidateQueries` para actualizar la UI en tiempo real tras mutaciones.
* **Diseño Profesional:** Interfaz limpia con soporte para modo claro y oscuro (Dark Mode).
* **Validaciones:** Validación de datos robusta tanto en el frontend como en el backend (Pydantic).

### Presentación del Proyecto

Puedes ver la demo completa y la explicación técnica en el siguiente video:

>  **https://youtu.be/VYdJWLIkThg**

---

### Instalación y Configuración

#### Requisitos Previos
* Python 3.10+
* Node.js 18+
* PostgreSQL funcionando localmente o en la nube.

#### Backend
1. Navega a la carpeta `/backend`.
2. Crea un entorno virtual: `python -m venv venv`.
3. Activa el entorno: `source venv/bin/activate` (Linux/Mac) o `venv\Scripts\activate` (Windows).
4. Instala las dependencias: `pip install -r requirements.txt`.
5. Configura tus variables de entorno en un archivo `.env` (DB_URL, etc.).
6. Ejecuta el servidor: **`python run.py`**.

#### Frontend
1. Navega a la carpeta `/frontend`.
2. Instala las dependencias: `npm install`.
3. Ejecuta la aplicación en modo desarrollo: `npm run dev`.
4. Abre `http://localhost:5173` en tu navegador.


---
**Desarrollado por:** Gonzalo Jaime </br>
**Materia:** Programación IV - Tecnicatura Universitaria en Programación (UTN)