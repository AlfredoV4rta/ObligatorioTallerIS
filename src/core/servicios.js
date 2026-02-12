const STORAGE_KEY_SERVICIOS = 'servicios';

const serviciosIniciales = [
    {
        id: 1,
        nombre: 'Consulta General',
        descripcion: 'Examen clínico completo de tu mascota. Evaluación del estado de salud general, diagnóstico de síntomas y recomendaciones preventivas. Incluye asesoramiento nutricional y de cuidados.',
        precio: 1200,
        icono: 'bi-clipboard2-pulse'
    },
    {
        id: 2,
        nombre: 'Vacunación y Desparasitación',
        descripcion: 'Aplicación de vacunas según calendario y tratamiento antiparasitario interno y externo. Protege a tu mascota de enfermedades comunes. Incluye certificado de vacunación.',
        precio: 900,
        icono: 'bi-shield-fill-check'
    },
    {
        id: 3,
        nombre: 'Castración',
        descripcion: 'Procedimiento quirúrgico de esterilización realizado por veterinarios especializados. Incluye pre-quirúrgico, anestesia, cirugía y post-operatorio. Control de seguimiento incluido.',
        precio: 8500,
        icono: 'bi-heart-pulse'
    },
    {
        id: 4,
        nombre: 'Baño y Estética',
        descripcion: 'Servicio completo de higiene y embellecimiento. Incluye baño medicado, corte de pelo según raza, corte de uñas, limpieza de oídos y glándulas. Perfumado y deslanado.',
        precio: 1500,
        icono: 'bi-scissors'
    }
];

function inicializarServicios() {
    const serviciosGuardados = localStorage.getItem(STORAGE_KEY_SERVICIOS);
    if (!serviciosGuardados) {
        localStorage.setItem(STORAGE_KEY_SERVICIOS, JSON.stringify(serviciosIniciales));
    }
}

function obtenerServicios() {
    inicializarServicios();
    const serviciosTexto = localStorage.getItem(STORAGE_KEY_SERVICIOS);

    if (!serviciosTexto) return [];

    const servicios = JSON.parse(serviciosTexto);
    return Array.isArray(servicios) ? servicios : [];
}

function obtenerServicioPorId(id) {
    const servicios = obtenerServicios();
    return servicios.find(servicio => servicio.id === id) || null;
}

export {
    obtenerServicios,
    obtenerServicioPorId
};