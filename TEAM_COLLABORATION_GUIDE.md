# 👥 Guía de Trabajo Colaborativo en GitHub (Para Todo el Equipo)

El docente evaluará que **todos los integrantes participen activamente en la codificación** dentro del repositorio de GitHub. Esta guía explica cómo distribuir las tareas para que cada miembro tenga ramas, commits y Pull Requests a su nombre en la gráfica de colaboradores de GitHub.

---

## 🎯 Roles y Asignación de Tareas por Integrante

A continuación se sugiere la división de trabajo para un equipo de 3 a 5 integrantes (adapten los nombres según su equipo):

| Integrante | Rol | Rama Asignada | Tarea Técnica Concreta |
| :--- | :--- | :--- | :--- |
| **Integrante 1 (Líder / DevOps)** | Arquitectura y CI/CD | `feature/setup-cicd` | Creación del repositorio, configuración de package.json y `.github/workflows/ci-cd.yml`. |
| **Integrante 2 (Backend)** | Lógica de Negocio | `feature/business-rules` | Implementación o ampliación de reglas en `appointmentService.js` (validaciones, filtros). |
| **Integrante 3 (QA / Testing)** | Pruebas Automatizadas | `feature/unit-tests` | Suite de pruebas en `tests/appointmentService.test.js` y `tests/api.test.js`. |
| **Integrante 4 (Frontend)** | Interfaz de Usuario | `feature/frontend-ui` | Mejoras visuales en `src/public/index.html` (estilos, modales, iconos). |
| **Integrante 5 (Demo Error / QA)** | Verificación de Calidad | `bugfix/demo-pipeline-error` | Ejecución de la rama con error deliberado y su posterior resolución en vivo. |

---

## 🚀 Flujo de Trabajo en Git (Paso a Paso)

### 1. Clonar el repositorio por cada integrante
Una vez que el Integrante 1 suba el repositorio a GitHub e invite a sus compañeros como colaboradores (*Settings* $\rightarrow$ *Collaborators* $\rightarrow$ *Add people*):

```bash
git clone https://github.com/TU-USUARIO/medisync-web-cicd.git
cd medisync-web-cicd
npm install
```

---

### 2. Flujo individual de cada integrante (Ejemplo Integrante 2 - Backend)

```bash
# 1. Crear y cambiarse a su rama
git checkout -b feature/business-rules

# 2. Realizar sus cambios o agregar mejoras en el código...
# (Por ejemplo, agregar una nueva especialidad en appointmentService.js)

# 3. Guardar y hacer commit con mensaje descriptivo
git add .
git commit -m "feat(backend): agregar nueva especialidad Odontología y validación asociada"

# 4. Subir la rama a GitHub
git push origin feature/business-rules
```

---

### 3. Flujo en la interfaz de GitHub (Code Review & PR)
1. Entrar al repositorio en GitHub.
2. Hacer clic en **Compare & pull request**.
3. Asignar a otro integrante como **Reviewer** (Revisor de código).
4. El revisor entra, revisa los cambios, deja un comentario de aprobación (*LGTM / Aprobado*) y presiona **Merge pull request**.
5. Esto activará el pipeline de CI/CD automáticamente y registrará la actividad del integrante en las estadísticas de GitHub (**Insights** $\rightarrow$ **Contributors**).

---

## 📊 Cómo Demostrar la Colaboración en la Exposición
Durante la presentación, abran GitHub y muestren:
1. **Pestaña "Insights" $\rightarrow$ "Contributors":** Muestra el gráfico con los commits de cada integrante.
2. **Pestaña "Pull requests" (Closed):** Muestra los PRs creados por cada integrante y aprobados por sus compañeros.
3. **Pestaña "Actions":** Muestra el historial de ejecuciones exitosas de cada Pull Request.
