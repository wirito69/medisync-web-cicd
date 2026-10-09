const express = require("express");
const path = require("path");
const appointmentService = require("./services/appointmentService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Endpoints de la API ---

// Healthcheck (clave para monitoreo de CI/CD y despliegue)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "MediSync API",
    version: "1.0.0"
  });
});

// Obtener especialidades disponibles
app.get("/api/specialties", (req, res) => {
  res.json({ data: appointmentService.getSpecialties() });
});

// Listar todas las citas médicas
app.get("/api/appointments", (req, res) => {
  res.json({
    data: appointmentService.getAllAppointments(),
    metrics: appointmentService.getMetrics()
  });
});

// Crear una nueva cita médica
app.post("/api/appointments", (req, res) => {
  try {
    const appointment = appointmentService.createAppointment(req.body);
    res.status(201).json({
      success: true,
      message: "Cita médica agendada exitosamente.",
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Cancelar una cita médica
app.patch("/api/appointments/:id/cancel", (req, res) => {
  try {
    const updated = appointmentService.cancelAppointment(req.params.id);
    res.json({
      success: true,
      message: "Cita cancelada con éxito.",
      data: updated
    });
  } catch (error) {
    const status = error.message.includes("No se encontró") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor solo si no se ejecuta desde pruebas unitarias
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[MediSync] Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
