const {
    validarEmail, 
    validarTelefono, 
    validarDatosReserva, 
    crearReserva, 
    obtenerProfesionalesDisponibles, 
    verificarDisponibilidadProfesional, 
    obtenerDuracionServicio
} = require('../src/core/reservas');

const obtenerProfesionales = require('../src/core/profesionales');

test('validarEmail caso error', () => {
    expect(validarEmail("emailinvalido")).toBeFalsy();
})

test('validarEmail caso exito', () => {
    expect(validarEmail("emailvalido@gmail.com")).toBeTruthy();
})

test('validarTelefono caso error', () => {
    expect(validarTelefono("53424")).toBeFalsy();
})

test('validarTelefono caso exito', () => {
    expect(validarTelefono("092345817")).toBeTruthy();
})