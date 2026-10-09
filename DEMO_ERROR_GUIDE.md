# 🔴 Guía de Demostración de Error de Código en el Pipeline CI/CD

Esta guía detalla paso a paso cómo realizar la **demostración en vivo requerida** en la exposición: provocar un fallo en el pipeline de GitHub Actions y luego corregirlo para demostrar la efectividad del sistema de integración continua.

---

## 🎯 Objetivo de la Demostración

Demostrar al docente y a la audiencia que:
1. El Pipeline **detecta automáticamente código defectuoso**.
2. **Bloquea la integración** hacia la rama principal (`main`), impidiendo que un bug llegue a producción.
3. Tras corregir el error y hacer un nuevo commit, el Pipeline **se reejecuta automáticamente y aprueba la integración (en verde)**.

---

## 📋 Método Recomendado: Romper una Regla Crítica de Negocio (Jest)

En `src/services/appointmentService.js`, tenemos una regla estricta: **no permitir citas médicas en fechas pasadas**.
Nuestra suite de pruebas en `tests/appointmentService.test.js` valida activamente esta regla.

### Paso 1: Crear una rama de demostración
Desde la terminal de cualquier integrante:

```bash
git checkout -b bugfix/demostracion-error-pipeline
```

---

### Paso 2: Introducir el error en el código
Abre el archivo [src/services/appointmentService.js](file:///src/services/appointmentService.js) y busca la siguiente validación (alrededor de la línea 60):

```javascript
// CÓDIGO ORIGINAL (CORRECTO):
const now = new Date();
if (appointmentDate <= now) {
  throw new Error("La fecha de la cita médica debe ser futura.");
}
```

**Comenta o elimina la validación para introducir el bug:**

```javascript
// CÓDIGO CON ERROR INTENCIONAL:
// const now = new Date();
// if (appointmentDate <= now) {
//   throw new Error("La fecha de la cita médica debe ser futura.");
// }
// (Al comentar esto, el sistema ahora permite citas en fechas pasadas)
```

---

### Paso 3: Subir los cambios a GitHub

```bash
git add src/services/appointmentService.js
git commit -m "feat: alterando validacion de fechas para demo"
git push origin bugfix/demostracion-error-pipeline
```

---

### Paso 4: Crear el Pull Request en GitHub y mostrar la falla en vivo

1. En GitHub, ve a la pestaña **Pull requests** y presiona **New pull request**.
2. Selecciona: `base: main` $\leftarrow$ `compare: bugfix/demostracion-error-pipeline`.
3. Haz clic en **Create pull request**.
4. **Durante la exposición (Pantalla compartida):**
   * Muestra cómo GitHub Actions inicia de inmediato el workflow `MediSync CI-CD Pipeline`.
   * El paso `🧪 Ejecución de Pruebas Unitarias y de Integración` **FALLARÁ en rojo (❌)**.
   * Explica al docente:
     > *"Como podemos observar en pantalla, el Pipeline detectó que un desarrollador eliminó una validación crítica de negocio. El test `Debe rechazar fechas pasadas` falló y GitHub bloquea automáticamente el botón de Merge para proteger producción."*

---

### Paso 5: Corregir el código en vivo y validar el éxito

1. En tu editor, deshaz el cambio (descomenta la validación):
```javascript
const now = new Date();
if (appointmentDate <= now) {
  throw new Error("La fecha de la cita médica debe ser futura.");
}
```

2. Haz commit y push del arreglo:
```bash
git add src/services/appointmentService.js
git commit -m "fix: restaurar validacion de fechas de citas medicas"
git push origin bugfix/demostracion-error-pipeline
```

3. **Vuelve a la pantalla de GitHub:**
   * Muestra cómo GitHub Actions detecta el nuevo commit al instante.
   * El pipeline vuelve a ejecutarse.
   * Ahora todos los checks se marcan en **verde (✔)**:
     - `🔍 Análisis Estático de Código (Linter)`: **PASSED**
     - `🧪 Pruebas Unitarias y de Integración`: **PASSED**
   * El botón de **Merge pull request** se desbloquea.
   * Realicen el merge a `main` y muestren cómo se ejecuta la fase de **CD (Despliegue a Producción)**.

---

## 💡 Alternativa Rápida: Error de Calidad (Linter)
Si desean mostrar cómo el análisis estático protege el código sin tocar la lógica:
1. En `src/server.js`, agrega una variable no usada o rompe el formato:
   ```javascript
   const variableSinUso = 12345;
   ```
2. Al hacer push, el paso `🔍 Análisis Estático de Código (Linter)` fallará con error ESLint `no-unused-vars`.
