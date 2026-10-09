/**
 * MediSync - Servicio de Lógica de Negocio de Citas Médicas
 * Gestiona la validación, programación y cancelación de consultas.
 */

const VALID_SPECIALTIES = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Traumatología"
];

class AppointmentService {
  constructor() {
    this.appointments = [];
    this.nextId = 1;
  }

  // Reiniciar estado (útil para pruebas unitarias)
  reset() {
    this.appointments = [];
    this.nextId = 1;
  }

  getSpecialties() {
    return [...VALID_SPECIALTIES];
  }

  getAllAppointments() {
    return [...this.appointments];
  }

  getAppointmentById(id) {
    return this.appointments.find((apt) => apt.id === Number(id)) || null;
  }

  /**
   * Valida y crea una nueva cita médica
   * @param {Object} data - Datos de la cita
   * @returns {Object} Cita creada
   */
  createAppointment({ patientName, doctorName, specialty, dateTime, reason }) {
    // Regla 1: Campos obligatorios
    if (!patientName || typeof patientName !== "string" || patientName.trim() === "") {
      throw new Error("El nombre del paciente es obligatorio.");
    }

    if (!doctorName || typeof doctorName !== "string" || doctorName.trim() === "") {
      throw new Error("El nombre del médico es obligatorio.");
    }

    // Regla 2: Especialidad válida
    if (!VALID_SPECIALTIES.includes(specialty)) {
      throw new Error(`Especialidad inválida. Debe ser una de: ${VALID_SPECIALTIES.join(", ")}`);
    }

    // Regla 3: Fecha válida y a futuro
    const appointmentDate = new Date(dateTime);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("La fecha y hora proporcionada no es válida.");
    }

    // [ERROR INTENCIONAL PARA DEMO CI/CD]
    // Se comenta la validación de fecha futura:
    // const now = new Date();
    // if (appointmentDate <= now) {
    //   throw new Error("La fecha de la cita médica debe ser futura.");
    // }

    // Regla 4: Disponibilidad del médico (sin cruce de horarios exactos)
    const doctorConflict = this.appointments.find(
      (apt) =>
        apt.doctorName.toLowerCase() === doctorName.trim().toLowerCase() &&
        apt.dateTime === appointmentDate.toISOString() &&
        apt.status !== "CANCELLED"
    );

    if (doctorConflict) {
      throw new Error(`El Dr. ${doctorName} ya tiene una cita reservada en ese horario.`);
    }

    // Regla 5: Disponibilidad del paciente
    const patientConflict = this.appointments.find(
      (apt) =>
        apt.patientName.toLowerCase() === patientName.trim().toLowerCase() &&
        apt.dateTime === appointmentDate.toISOString() &&
        apt.status !== "CANCELLED"
    );

    if (patientConflict) {
      throw new Error("El paciente ya cuenta con una cita programada en ese horario.");
    }

    const newAppointment = {
      id: this.nextId++,
      patientName: patientName.trim(),
      doctorName: doctorName.trim(),
      specialty,
      dateTime: appointmentDate.toISOString(),
      reason: reason ? reason.trim() : "Consulta general",
      status: "CONFIRMED",
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  /**
   * Cancela una cita existente
   * @param {number} id - ID de la cita
   * @returns {Object} Cita actualizada
   */
  cancelAppointment(id) {
    const appointment = this.getAppointmentById(id);

    if (!appointment) {
      throw new Error(`No se encontró la cita médica con ID ${id}.`);
    }

    if (appointment.status === "CANCELLED") {
      throw new Error("La cita ya se encuentra cancelada.");
    }

    appointment.status = "CANCELLED";
    appointment.cancelledAt = new Date().toISOString();
    return appointment;
  }

  /**
   * Métricas para el Dashboard de la Clínica
   */
  getMetrics() {
    const total = this.appointments.length;
    const confirmed = this.appointments.filter((a) => a.status === "CONFIRMED").length;
    const cancelled = this.appointments.filter((a) => a.status === "CANCELLED").length;

    return {
      total,
      confirmed,
      cancelled,
      activeDoctors: [...new Set(this.appointments.map((a) => a.doctorName))].length
    };
  }
}

module.exports = new AppointmentService();
