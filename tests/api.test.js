const request = require("supertest");
const app = require("../src/server");
const appointmentService = require("../src/services/appointmentService");

describe("Endpoints de la API REST de MediSync", () => {
  beforeEach(() => {
    appointmentService.reset();
  });

  test("GET /api/health debe responder 200 con estado UP", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("UP");
    expect(res.body.service).toBe("MediSync API");
  });

  test("GET /api/specialties debe devolver la lista de especialidades", async () => {
    const res = await request(app).get("/api/specialties");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toContain("Cardiología");
  });

  test("POST /api/appointments debe registrar una cita correctamente", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const res = await request(app)
      .post("/api/appointments")
      .send({
        patientName: "Sofía Castro",
        doctorName: "Dr. Mario Rossi",
        specialty: "Medicina General",
        dateTime: futureDate.toISOString(),
        reason: "Chequeo preventivo"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.patientName).toBe("Sofía Castro");
  });

  test("POST /api/appointments debe responder 400 si faltan datos requeridos", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .send({
        doctorName: "Dr. Mario Rossi",
        specialty: "Medicina General"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  test("PATCH /api/appointments/:id/cancel debe responder 404 si la cita no existe", async () => {
    const res = await request(app).patch("/api/appointments/999/cancel");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
