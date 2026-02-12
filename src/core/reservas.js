const STORAGE_KEY_RESERVAS = "vh_reservas";

// Duración de servicios en minutos
const DURACION_SERVICIOS = {
    "Consulta General": 30,
    "Vacunación y Desparasitación": 15,
    "Castración": 120,
    "Baño y Estética": 60
};

// Horarios de atención (9:00 a 18:00)
const HORA_INICIO = 9;
const HORA_FIN = 18;

function inicializarReservas() {
    const reservasExistentes = localStorage.getItem(STORAGE_KEY_RESERVAS);
    if (reservasExistentes === null) {
        localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify([]));
    }
}

function obtenerReservas() {
    inicializarReservas();
    const data = localStorage.getItem(STORAGE_KEY_RESERVAS);

    if (data === null) {
        return [];
    }

    return JSON.parse(data);
}

function obtenerReservaPorId(id) {
    const reservas = obtenerReservas();
    const reserva = reservas.find(r => r.id === id);

    if (reserva === undefined) {
        return null;
    }

    return reserva;
}

/**
 * Obtiene la duración en minutos de un servicio
 */
function obtenerDuracionServicio(nombreServicio) {
    const duracion = DURACION_SERVICIOS[nombreServicio];

    if (duracion === undefined) {
        return 30; // Duración por defecto
    }

    return duracion;
}

/**
 * Convierte una hora en formato "HH:MM" a minutos desde medianoche
 */
function horaAMinutos(hora) {
    const partes = hora.split(":");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);
    return horas * 60 + minutos;
}

/**
 * Convierte minutos desde medianoche a formato "HH:MM"
 */
function minutosAHora(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Verifica si un profesional está disponible en un horario específico
 */
function verificarDisponibilidadProfesional(profesionalId, fecha, horaInicio, duracion) {
    const reservas = obtenerReservas();
    const minutosInicio = horaAMinutos(horaInicio);
    const minutosFin = minutosInicio + duracion;

    // Buscar reservas del mismo profesional en la misma fecha
    for (let i = 0; i < reservas.length; i++) {
        const reserva = reservas[i];

        // Verificar si es el mismo profesional y la misma fecha
        if (reserva.profesional_id === profesionalId && reserva.fecha === fecha) {
            const reservaInicio = horaAMinutos(reserva.hora);
            const reservaFin = reservaInicio + reserva.duracion_minutos;

            // Verificar si hay solapamiento
            const haySolapamiento = (minutosInicio < reservaFin && minutosFin > reservaInicio);

            if (haySolapamiento === true) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Obtiene profesionales disponibles para un servicio en una fecha/hora
 */
function obtenerProfesionalesDisponibles(tipoServicio, fecha, hora) {
    // Importar función de profesionales
    const todosLosProfesionales = obtenerProfesionales();
    const duracion = obtenerDuracionServicio(tipoServicio);
    const disponibles = [];

    for (let i = 0; i < todosLosProfesionales.length; i++) {
        const profesional = todosLosProfesionales[i];
        const estaDisponible = verificarDisponibilidadProfesional(
            profesional.id,
            fecha,
            hora,
            duracion
        );

        if (estaDisponible === true) {
            disponibles.push(profesional);
        }
    }

    return disponibles;
}

/**
 * Valida los datos de una reserva
 */
function validarDatosReserva(datos) {
    const errores = [];

    // Validar nombre del dueño
    if (datos.nombre_dueno === undefined || datos.nombre_dueno === null || datos.nombre_dueno.trim() === "") {
        errores.push("El nombre del dueño es obligatorio");
    }

    // Validar nombre de la mascota
    if (datos.nombre_mascota === undefined || datos.nombre_mascota === null || datos.nombre_mascota.trim() === "") {
        errores.push("El nombre de la mascota es obligatorio");
    }

    // Validar teléfono o email (al menos uno)
    const tieneTelefono = datos.telefono !== undefined && datos.telefono !== null && datos.telefono.trim() !== "";
    const tieneEmail = datos.email !== undefined && datos.email !== null && datos.email.trim() !== "";

    if (tieneTelefono === false && tieneEmail === false) {
        errores.push("Debe proporcionar al menos un teléfono o email");
    }

    // Validar tipo de servicio
    if (datos.tipo_servicio === undefined || datos.tipo_servicio === null || datos.tipo_servicio.trim() === "") {
        errores.push("Debe seleccionar un tipo de servicio");
    }

    // Validar fecha
    if (datos.fecha === undefined || datos.fecha === null || datos.fecha.trim() === "") {
        errores.push("La fecha es obligatoria");
    }

    // Validar hora
    if (datos.hora === undefined || datos.hora === null || datos.hora.trim() === "") {
        errores.push("La hora es obligatoria");
    }

    return errores;
}

/**
 * Crea una nueva reserva
 */
function crearReserva(datos) {
    // Validar datos
    const errores = validarDatosReserva(datos);

    if (errores.length > 0) {
        return {
            exito: false,
            errores: errores
        };
    }

    const duracion = obtenerDuracionServicio(datos.tipo_servicio);

    // Si tiene profesional asignado, verificar disponibilidad
    if (datos.profesional_id !== undefined && datos.profesional_id !== null) {
        const disponible = verificarDisponibilidadProfesional(
            datos.profesional_id,
            datos.fecha,
            datos.hora,
            duracion
        );

        if (disponible === false) {
            return {
                exito: false,
                errores: ["El profesional seleccionado no está disponible en ese horario"]
            };
        }
    } else {
        // Si no tiene profesional, asignar uno disponible automáticamente
        const profesionalesDisponibles = obtenerProfesionalesDisponibles(
            datos.tipo_servicio,
            datos.fecha,
            datos.hora
        );

        if (profesionalesDisponibles.length === 0) {
            return {
                exito: false,
                errores: ["No hay profesionales disponibles en ese horario"]
            };
        }

        // Asignar el primer profesional disponible
        datos.profesional_id = profesionalesDisponibles[0].id;
    }

    const reservas = obtenerReservas();

    const nuevaReserva = {
        id: Date.now(),
        nombre_dueno: datos.nombre_dueno.trim(),
        nombre_mascota: datos.nombre_mascota.trim(),
        telefono: datos.telefono === undefined || datos.telefono === null ? "" : datos.telefono.trim(),
        email: datos.email === undefined || datos.email === null ? "" : datos.email.trim(),
        tipo_servicio: datos.tipo_servicio,
        profesional_id: datos.profesional_id,
        fecha: datos.fecha,
        hora: datos.hora,
        duracion_minutos: duracion,
        fecha_creacion: new Date().toISOString(),
        estado: "confirmada"
    };

    reservas.push(nuevaReserva);
    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas));

    return {
        exito: true,
        reserva: nuevaReserva
    };
}

/**
 * Elimina una reserva (libera automáticamente el horario del profesional)
 */
function eliminarReserva(id) {
    const reservas = obtenerReservas();
    const indiceReserva = reservas.findIndex(r => r.id === id);

    if (indiceReserva === -1) {
        return {
            exito: false,
            mensaje: "Reserva no encontrada"
        };
    }

    const reservaEliminada = reservas[indiceReserva];
    reservas.splice(indiceReserva, 1);

    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas));

    return {
        exito: true,
        mensaje: "Reserva eliminada exitosamente",
        reserva: reservaEliminada
    };
}

/**
 * Obtiene todas las reservas ordenadas por fecha y hora
 */
function obtenerReservasOrdenadas() {
    const reservas = obtenerReservas();

    // Ordenar por fecha y hora
    reservas.sort((a, b) => {
        if (a.fecha === b.fecha) {
            return horaAMinutos(a.hora) - horaAMinutos(b.hora);
        }
        return a.fecha.localeCompare(b.fecha);
    });

    return reservas;
}

/**
 * Obtiene reservas por fecha
 */
function obtenerReservasPorFecha(fecha) {
    const reservas = obtenerReservas();
    const reservasFecha = [];

    for (let i = 0; i < reservas.length; i++) {
        if (reservas[i].fecha === fecha) {
            reservasFecha.push(reservas[i]);
        }
    }

    return reservasFecha;
}

/**
 * Obtiene horarios disponibles para un servicio en una fecha
 */
function obtenerHorariosDisponibles(tipoServicio, fecha, profesionalId) {
    const duracion = obtenerDuracionServicio(tipoServicio);
    const horariosDisponibles = [];

    // Generar todos los horarios posibles (cada 15 minutos)
    for (let hora = HORA_INICIO; hora < HORA_FIN; hora++) {
        for (let minutos = 0; minutos < 60; minutos += 15) {
            const horaString = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            const minutosInicio = hora * 60 + minutos;
            const minutosFin = minutosInicio + duracion;

            // Verificar que no exceda el horario de cierre
            if (minutosFin <= HORA_FIN * 60) {
                let disponible = true;

                if (profesionalId !== undefined && profesionalId !== null) {
                    disponible = verificarDisponibilidadProfesional(
                        profesionalId,
                        fecha,
                        horaString,
                        duracion
                    );
                } else {
                    const profesionalesDisp = obtenerProfesionalesDisponibles(
                        tipoServicio,
                        fecha,
                        horaString
                    );
                    disponible = profesionalesDisp.length > 0;
                }

                if (disponible === true) {
                    horariosDisponibles.push(horaString);
                }
            }
        }
    }

    return horariosDisponibles;
}

export {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    eliminarReserva,
    obtenerReservasOrdenadas,
    obtenerReservasPorFecha,
    obtenerHorariosDisponibles,
    obtenerDuracionServicio,
    obtenerProfesionalesDisponibles
};