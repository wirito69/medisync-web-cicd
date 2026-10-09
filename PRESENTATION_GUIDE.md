# 🎤 Guión y Estructura de Exposición (20 a 30 Minutos)

**Proyecto:** MediSync - Plataforma Web de Citas Médicas con Pipeline CI/CD Automatizado  
**Duración Total Estimada:** 25 minutos (rango 20 - 30 min)

---

## ⏱️ Cronograma Minuto a Minuto

```
[00:00 - 05:00]  Parte 1: Presentación del Equipo y Giro de Negocio
[05:00 - 09:00]  Parte 2: Arquitectura de la Solución y Trabajo Colaborativo en Git
[09:00 - 15:00]  Parte 3: Fundamentos y Estructura del Pipeline CI/CD
[15:00 - 22:00]  Parte 4: DEMOSTRACIÓN EN VIVO (Error Controlado + Corrección)
[22:00 - 26:00]  Parte 5: Demostración del Software y Métricas en Tiempo Real
[26:00 - 30:00]  Parte 6: Conclusiones, Lecciones Aprendidas y Ronda de Preguntas
```

---

## 📑 Detalle de Cada Sección y Qué Decir

### 1. Presentación y Giro de Negocio (00:00 - 05:00) | *Expositor 1*
* **Saludo inicial:** Saludar al docente y compañeros, mencionar el nombre del equipo y el título del proyecto.
* **El Problema del Negocio:**
  > *"En el sector de la salud ambulatoria, el ausentismo de pacientes ronda entre el 25% y el 30%. Esto genera pérdidas millonarias en horas médicas desaprovechadas y satura los canales de atención telefónica de las clínicas."*
* **Nuestra Solución (MediSync):**
  > *"MediSync es un SaaS web que automatiza la agenda clínica, valida en tiempo real la disponibilidad de médicos sin solapamiento de horarios y permite a los pacientes reservar citas 24/7."*
* **Modelo de Negocio / Monetización:**
  > *"Es un modelo B2B Freemium: básico hasta 2 médicos, y planes de suscripción mensual con recordatorios SMS/WhatsApp y analítica para clínicas medianas."*

---

### 2. Arquitectura y Colaboración en GitHub (05:00 - 09:00) | *Expositor 2*
* **Stack Tecnológico:**
  * Backend: Node.js con Express (arquitectura modular basada en servicios).
  * Frontend: SPA responsiva con Tailwind CSS y métricas en tiempo real.
  * Testing: Jest (pruebas unitarias de lógica y Supertest para endpoints API).
  * CI/CD: GitHub Actions con runners en Ubuntu.
* **Evidencia de Colaboración en Equipo:**
  * **(Mostrar pantalla del repositorio):**
    * Pestaña `Insights` $\rightarrow$ `Contributors`: Mostrar los commits de cada integrante.
    * Pestaña `Pull requests` (Closed): Explicar la política de ramas (`feature/*`, `develop`, `main`) y que ningún cambio entra directo a `main` sin pasar por revisión de código (Code Review) y por el pipeline de CI.

---

### 3. Explicación Técnica del Pipeline de CI/CD (09:00 - 15:00) | *Expositor 3*
* **(Abrir archivo `.github/workflows/ci-cd.yml` en pantalla):**
  * **Triggers (Disparadores):**
    * `push` y `pull_request` sobre `main` y `develop`.
  * **Fase 1: Integración Continua (CI):**
    1. *Checkout del repositorio:* Descarga la versión exacta del commit.
    2. *Setup Node.js con caché de npm:* Optimiza el tiempo de ejecución en los runners.
    3. *Linting (ESLint):* Puerta de calidad estática. Evita sintaxis sucia o variables no utilizadas.
    4. *Testing y Cobertura (Jest):* Ejecuta 12 pruebas automatizadas y exige más del 90% de cobertura.
    5. *Publicación de artefactos:* Sube el reporte de cobertura HTML para auditoría.
  * **Fase 2: Despliegue Continuo (CD):**
    * Condicional: Solo se activa si la rama es `main` y la fase CI terminó en estado **verde**.
    * Empaqueta el bundle de producción y simula el pase a producción (`$GITHUB_STEP_SUMMARY`).

---

### 4. DEMOSTRACIÓN EN VIVO: El Error de Código (15:00 - 22:00) | *Expositor 4 (Momento Clave)*
> ⚠️ **Este es el punto más importante de la rúbrica de evaluación.**

1. **El Expositor 4 comparte pantalla con el editor y GitHub abiertos:**
   > *"A continuación, demostraremos cómo el Pipeline de CI/CD actúa como un escudo de calidad. Simularemos que un desarrollador introduce un error que permite registrar citas médicas en el pasado."*
2. **Acción en vivo:**
   * Abre la rama `bugfix/demo-pipeline-error`.
   * En `src/services/appointmentService.js`, comenta la validación de fecha futura.
   * Ejecuta:
     ```bash
     git add src/services/appointmentService.js
     git commit -m "test: omitir validacion de fecha para demostracion"
     git push origin bugfix/demo-pipeline-error
     ```
3. **Mostrar GitHub Actions:**
   * Abre el Pull Request en GitHub.
   * El pipeline se dispara automáticamente.
   * **Se visualiza la ❌ ROJA en el paso de tests.**
   * Explicar al jurado:
     > *"Observen cómo Jest detectó la violación de la regla de negocio y GitHub Actions bloqueó el Pull Request. Ningún cambio roto puede llegar a producción."*
4. **Corrección inmediata en vivo:**
   * Descomenta la validación en el código.
   * Realiza un nuevo push:
     ```bash
     git add src/services/appointmentService.js
     git commit -m "fix: restaurar validacion de fecha futura"
     git push origin bugfix/demo-pipeline-error
     ```
   * En 30 segundos, el pipeline vuelve a correr y se marca en **VERDE (✔)**.
   * Se aprueba el Pull Request y se ejecuta el merge hacia `main`.

---

### 5. Demostración de la Aplicación Web (22:00 - 26:00) | *Expositor 5*
* **(Abrir la web en `http://localhost:3000` o URL desplegada):**
  * Mostrar el panel de control y las tarjetas de métricas (*Total, Confirmadas, Canceladas, Médicos*).
  * Crear una cita válida en vivo.
  * Intentar crear una cita en fecha pasada o duplicada con el mismo médico para mostrar cómo el frontend y la API responden con validación adecuada.
  * Cancelar una cita y ver cómo las métricas se actualizan en vivo.
  * Abrir los modales informativos integrados en la barra de navegación (*Giro de Negocio* y *Arquitectura CI/CD*).

---

### 6. Conclusiones y Preguntas (26:00 - 30:00) | *Todos los Integrantes*
* **Conclusiones clave:**
  1. La automatización de CI/CD reduce drásticamente el tiempo de ciclo de entrega de valor al usuario.
  2. Los Quality Gates (Linter + Tests) evitan que errores humanos rompan el entorno productivo.
  3. La colaboración estructurada mediante Git Flow y Pull Requests garantiza trazabilidad y responsabilidad compartida.
* **Apertura a preguntas del docente.**

---

## ❓ Preguntas Frecuentes del Docente y Cómo Responder

1. **¿Por qué separaron CI de CD?**
   * *Respuesta:* Porque la Integración Continua (CI) debe ejecutarse en todas las ramas y PRs para validar la calidad del código en desarrollo, mientras que el Despliegue Continuo (CD) solo debe ejecutarse tras la aprobación en la rama principal (`main`) para no desplegar código inestable.
2. **¿Qué métricas de cobertura obtuvieron?**
   * *Respuesta:* Nuestra suite de Jest alcanza un **93.75% de cobertura de código en declaraciones** y valida las 6 reglas de negocio principales.
3. **¿Cómo garantiza el pipeline que no se suba código con dependencias rotas?**
   * *Respuesta:* Usamos `npm ci` en lugar de `npm install`, lo cual instala exactamente las versiones congeladas en `package-lock.json`, garantizando builds reproducibles y deterministas.
