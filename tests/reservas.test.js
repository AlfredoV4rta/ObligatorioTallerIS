// Mock global ANTES de cualquier require
global.obtenerProfesionales = require('../src/core/profesionales');

const {
    validarEmail,
    validarTelefono,
    validarDatosReserva,
    crearReserva,
    obtenerProfesionalesDisponibles,
    verificarDisponibilidadProfesional,
    obtenerDuracionServicio
} = require('../src/core/reservas');

// Pruebas para validarEmail

test('validarEmail caso error', () => {
    expect(validarEmail("emailinvalido")).toBeFalsy();
})

test('validarEmail caso exito', () => {
    expect(validarEmail("emailvalido@gmail.com")).toBeTruthy();
})

// Pruebas para validarTelefono

test('validarTelefono caso error', () => {
    expect(validarTelefono("53424")).toBeFalsy();
})

test('validarTelefono caso exito', () => {
    expect(validarTelefono("092345817")).toBeTruthy();
})

// Pruebas para validarDatosReserva

test('validarDatosReserva caso error nombre dueño obligatorio', () => {
    const datos = {
        nombre_dueno: "",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "fede.oteiza@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["El nombre del dueño es obligatorio"]);
})

test('validarDatosReserva caso error nombre mascota obligatorio', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "",
        telefono: "092345817",
        email: "fede.oteiza@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["El nombre de la mascota es obligatorio"]);
})

test('validarDatosReserva caso error sin telefono e email', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "",
        email: "",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["Debe proporcionar al menos un teléfono o email"]);
})

test('validarDatosReserva caso error email invalido', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "emailinvalido",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["El email debe contener @ y terminar en .com"]);
})

test('validarDatosReserva caso error telefono invalido', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "53424",
        email: "fede.oteiza@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["El teléfono debe tener 9 dígitos y comenzar con 09"]);
})

test('validarDatosReserva caso error tipo de servicio faltante', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "fede.oteiza@gmail.com",
        tipo_servicio: "",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["Debe seleccionar un tipo de servicio"]);
})

test('validarDatosReserva caso error fecha faltante', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["La fecha es obligatoria"]);
})

test('validarDatosReserva caso error hora faltante', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: ""
    }
    expect(validarDatosReserva(datos)).toStrictEqual(["La hora es obligatoria"]);
})

test('validarDatosReserva caso exito', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(validarDatosReserva(datos)).toStrictEqual([]);
})

// Pruebas para obtenerProfesionalesDisponibles

test('obtenerProfesionalesDisponibles caso veterinarios', () => {
    expect(obtenerProfesionalesDisponibles("Consulta General", "2026-03-12", "10:00")).toStrictEqual([{
        id: 1,
        nombre: "Dra. Sofía Pereira",
        tipo: "Veterinaria",
        foto: "img/mujer1.png",
        especialidad: "Clínica general y medicina preventiva (vacunas, controles)",
        bio: "Me enfoco en prevenir problemas antes de que aparezcan y en explicar todo de forma clara.",
        servicios: ["Consulta General", "Vacunación y Desparasitación", "Castración", "Estética y baño"],
    },
    {
        id: 2,
        nombre: "Dr. Martín Rodríguez",
        tipo: "Veterinario",
        foto: "img/hombre1.png",
        especialidad: "Cirugía menor (castraciones) y urgencias",
        bio: "Trabajo con procedimientos seguros y un seguimiento postoperatorio cercano.",
        servicios: ["Consulta General", "Vacunación y Desparasitación", "Castración", "Estética y baño"],
    }]);
})

test('obtenerProfesionalesDisponibles caso estetica', () => {
    expect(obtenerProfesionalesDisponibles("Estética y baño", "2026-03-12", "10:00")).toStrictEqual([{
        id: 1,
        nombre: "Dra. Sofía Pereira",
        tipo: "Veterinaria",
        foto: "img/mujer1.png",
        especialidad: "Clínica general y medicina preventiva (vacunas, controles)",
        bio: "Me enfoco en prevenir problemas antes de que aparezcan y en explicar todo de forma clara.",
        servicios: ["Consulta General", "Vacunación y Desparasitación", "Castración", "Estética y baño"],
    },
    {
        id: 2,
        nombre: "Dr. Martín Rodríguez",
        tipo: "Veterinario",
        foto: "img/hombre1.png",
        especialidad: "Cirugía menor (castraciones) y urgencias",
        bio: "Trabajo con procedimientos seguros y un seguimiento postoperatorio cercano.",
        servicios: ["Consulta General", "Vacunación y Desparasitación", "Castración", "Estética y baño"],
    },
    {
        id: 3,
        nombre: "Valentina López",
        tipo: "Estética y baño",
        foto: "img/mujer2.png",
        especialidad: "Baño, secado, corte higiénico y manejo de mascotas nerviosas",
        bio: "Prioridad: que la experiencia sea tranquila y sin estrés.",
        servicios: ["Estética y baño"],
    }]);
})

// Prueba crearReserva

test('crearReserva caso exito', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }
    expect(crearReserva(datos)).toStrictEqual({exito: true, reserva: {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Firulais",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        profesional_id: 1,
        fecha: "2026-03-12",
        hora: "10:00",
        duracion_minutos: 60,
        fecha_creacion: new Date().getDate(),
        estado: "confirmada"
    }})
})

test('crearReserva caso error validacion', () => {
    const datos = {
        nombre_dueno: "Juan Perez",
        nombre_mascota: "Mili",
        telefono: "092345817",
        email: "juanperez@gmail.com",
        tipo_servicio: "Estética y baño",
        fecha: "2026-03-12",
        hora: "10:00"
    }

    crearReserva(datos);
    crearReserva(datos);
    crearReserva(datos);

    expect(crearReserva(datos)).toStrictEqual({exito: false, errores: ["El profesional seleccionado no está disponible en ese horario"]})
})