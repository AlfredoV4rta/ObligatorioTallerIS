/**
 * Módulo Core - Reservas
 * Responsabilidad: Gestión de datos de reservas (CRUD y lógica de negocio)
 * NO interactúa con el DOM
 */

const STORAGE_KEY_RESERVAS = "vh_reservas";

function inicializarReservas() {
    if (!localStorage.getItem(STORAGE_KEY_RESERVAS)) {
        localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify([]));
    }
}

function obtenerReservas() {
    inicializarReservas();
    const data = localStorage.getItem(STORAGE_KEY_RESERVAS);
    return data ? JSON.parse(data) : [];
}

function crearReserva(reserva) {
    const reservas = obtenerReservas();
    const nuevaReserva = {
        ...reserva,
        id: Date.now(),
        fecha_creacion: new Date().toISOString()
    };
    reservas.push(nuevaReserva);
    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas));
    return nuevaReserva;
}

function obtenerReservaPorId(id) {
    const reservas = obtenerReservas();
    return reservas.find(reserva => reserva.id === id) || null;
}

function actualizarReserva(id, datosActualizados) {
    const reservas = obtenerReservas();
    const indice = reservas.findIndex(reserva => reserva.id === id);

    if (indice === -1) return null;

    reservas[indice] = {
        ...reservas[indice],
        ...datosActualizados,
        fecha_modificacion: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas));
    return reservas[indice];
}

function eliminarReserva(id) {
    const reservas = obtenerReservas();
    const reservasFiltradas = reservas.filter(reserva => reserva.id !== id);

    if (reservas.length === reservasFiltradas.length) return false;

    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservasFiltradas));
    return true;
}

export {
    obtenerReservas,
    crearReserva,
    obtenerReservaPorId,
    actualizarReserva,
    eliminarReserva
};