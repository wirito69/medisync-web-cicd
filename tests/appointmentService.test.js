const appointmentService = require("../src/services/appointmentService");

describe("Servicio de Citas Médicas (AppointmentService) - Reglas de Negocio", () => {
  beforeEach(() => {
    appointmentService.reset();
  });

  const getFutureDate = (daysAhead = 2, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  test("Debe agendar una cita médica exitosamente con datos válidos", () => {
    const payload = {
      patientName: "Carlos Alarcón",
      doctorName: "Dr. Mario Rossi",
      specialty: "Medicina General",
      dateTime: getFutureDate(3, 9),
      reason: "Dolor estomacal"
    };

    const apt = appointmentService.createAppointment(payload);

    expect(apt).toBeDefined();
    expect(apt.id).toBe(1);
    expect(apt.patientName).toBe("Carlos Alarcón");
    expect(apt.doctorName).toBe("Dr. Mario Rossi");
    expect(apt.status).toBe("CONFIRMED");
  });

  test("Debe fallar si el nombre del paciente o médico está vacío", () => {
    expect(() => {
      appointmentService.createAppointment({
        patientName: "",
        doctorName: "Dr. Rossi",
        specialty: "Pediatría",
        dateTime: getFutureDate(1)
      });
    }).toThrow("El nombre del paciente es obligatorio.");

    expect(() => {
      appointmentService.createAppointment({
        patientName: "Juan Pérez",
        doctorName: "   ",
        specialty: "Pediatría",
        dateTime: getFutureDate(1)
      });
    }).toThrow("El nombre del médico es obligatorio.");
  });

  test("Debe rechazar especialidades no autorizadas", () => {
    expect(() => {
      appointmentService.createAppointment({
        patientName: "Juan Pérez",
        doctorName: "Dr. Smith",
        specialty: "Astronomía",
        dateTime: getFutureDate(1)
      });
    }).toThrow(/Especialidad inválida/);
  });

  test("Debe rechazar fechas pasadas (Regla crítica de negocio)", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    expect(() => {
      appointmentService.createAppointment({
        patientName: "María López",
        doctorName: "Dr. Mario Rossi",
        specialty: "Dermatología",
        dateTime: pastDate.toISOString()
      });
    }).toThrow("La fecha de la cita médica debe ser futura.");
  });

  test("Debe evitar el solapamiento de horarios para el mismo médico", () => {
    const sharedDate = getFutureDate(4, 11);

    appointmentService.createAppointment({
      patientName: "Paciente 1",
      doctorName: "Dr. Mario Rossi",
      specialty: "Cardiología",
      dateTime: sharedDate
    });

    expect(() => {
      appointmentService.createAppointment({
        patientName: "Paciente 2",
        doctorName: "Dr. Mario Rossi",
        specialty: "Cardiología",
        dateTime: sharedDate
      });
    }).toThrow(/ya tiene una cita reservada en ese horario/);
  });

  test("Debe cancelar una cita existente y actualizar métricas", () => {
    const apt = appointmentService.createAppointment({
      patientName: "Laura Silva",
      doctorName: "Dr. Mario Rossi",
      specialty: "Traumatología",
      dateTime: getFutureDate(5)
    });

    const cancelled = appointmentService.cancelAppointment(apt.id);
    expect(cancelled.status).toBe("CANCELLED");
    expect(cancelled.cancelledAt).toBeDefined();

    // Intentar cancelar de nuevo debe fallar
    expect(() => {
      appointmentService.cancelAppointment(apt.id);
    }).toThrow("La cita ya se encuentra cancelada.");
  });

  test("Debe calcular métricas correctas de ocupación", () => {
    const apt1 = appointmentService.createAppointment({
      patientName: "P1",
      doctorName: "Dr. A",
      specialty: "Pediatría",
      dateTime: getFutureDate(1, 8)
    });

    appointmentService.createAppointment({
      patientName: "P2",
      doctorName: "Dr. B",
      specialty: "Cardiología",
      dateTime: getFutureDate(2, 9)
    });

    appointmentService.cancelAppointment(apt1.id);

    const metrics = appointmentService.getMetrics();
    expect(metrics.total).toBe(2);
    expect(metrics.confirmed).toBe(1);
    expect(metrics.cancelled).toBe(1);
    expect(metrics.activeDoctors).toBe(2);
  });
});
