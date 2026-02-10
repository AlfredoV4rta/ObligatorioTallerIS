/**
 * Script de Inicialización de Datos
 * Precarga los servicios de la veterinaria en LocalStorage
 */
localStorage.clear();
(function () {
    'use strict';

    /**
     * Estructura de datos para los servicios de la veterinaria
     * Cada servicio incluye: id, nombre, descripción, precio e ícono
     */
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

    /**
     * Inicializa los servicios en LocalStorage
     * Solo carga los datos si no existen previamente
     */
    function inicializarServicios() {
        try {
            // Verificar si ya existen servicios en LocalStorage
            const serviciosGuardados = localStorage.getItem('servicios');

            if (!serviciosGuardados) {
                // Si no existen, guardar los servicios iniciales
                localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
                console.log('✅ Servicios inicializados correctamente en LocalStorage');
                console.log('📋 Total de servicios cargados:', serviciosIniciales.length);
            } else {
                // Si ya existen, verificar que sean válidos
                const servicios = JSON.parse(serviciosGuardados);
                if (!Array.isArray(servicios) || servicios.length === 0) {
                    // Si los datos están corruptos, reinicializar
                    localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
                    console.log('⚠️ Servicios reinicializados (datos previos inválidos)');
                } else {
                    console.log('✅ Servicios ya existentes en LocalStorage');
                    console.log('📋 Total de servicios:', servicios.length);
                }
            }
        } catch (error) {
            console.error('❌ Error al inicializar servicios:', error);
            // En caso de error, intentar guardar los datos iniciales
            try {
                localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
                console.log('✅ Servicios guardados después de error');
            } catch (e) {
                console.error('❌ Error crítico al guardar servicios:', e);
            }
        }
    }

    /**
     * Función de utilidad para obtener todos los servicios
     * @returns {Array} Array de servicios o array vacío si hay error
     */
    window.obtenerServicios = function () {
        try {
            const servicios = localStorage.getItem('servicios');
            return servicios ? JSON.parse(servicios) : [];
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            return [];
        }
    };

    /**
     * Función de utilidad para obtener un servicio por ID
     * @param {number} id - ID del servicio
     * @returns {Object|null} Objeto servicio o null si no existe
     */
    window.obtenerServicioPorId = function (id) {
        try {
            const servicios = window.obtenerServicios();
            return servicios.find(servicio => servicio.id === id) || null;
        } catch (error) {
            console.error('Error al obtener servicio por ID:', error);
            return null;
        }
    };

    /**
     * Función de utilidad para resetear servicios a valores iniciales
     * Útil para desarrollo y pruebas
     */
    window.reiniciarServicios = function () {
        try {
            localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
            console.log('✅ Servicios reseteados a valores iniciales');
            // Recargar la página para reflejar los cambios
            if (typeof cargarServicios === 'function') {
                cargarServicios();
            }
        } catch (error) {
            console.error('Error al reiniciar servicios:', error);
        }
    };

    // Inicializar servicios cuando el script se carga
    inicializarServicios();

    // Log de bienvenida
    console.log('🐾 Sistema de Gestión de Veterinaria - Inicializado');
    console.log('📦 Datos cargados en LocalStorage');
})();