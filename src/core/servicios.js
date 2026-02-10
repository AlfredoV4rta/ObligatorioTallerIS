/**
 * Módulo de Gestión de Servicios
 * Maneja la visualización del catálogo de servicios desde LocalStorage
 */

(function() {
    'use strict';

    // Referencias a elementos del DOM
    const contenedorCatalogo = document.getElementById('catalogoServicios');
    const mensajeCargando = document.getElementById('mensajeCargando');
    const mensajeError = document.getElementById('mensajeError');

    /**
     * Mapeo de iconos para cada servicio
     * Bootstrap Icons
     */
    const iconosServicios = {
        'bi-clipboard2-pulse': 'bi-clipboard2-pulse',
        'bi-shield-fill-check': 'bi-shield-fill-check',
        'bi-heart-pulse': 'bi-heart-pulse',
        'bi-scissors': 'bi-scissors'
    };

    /**
     * Formatea el precio en formato de moneda argentina
     * @param {number} precio - Precio a formatear
     * @returns {string} Precio formateado
     */
    function formatearPrecio(precio) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    }

    /**
     * Crea una tarjeta HTML para un servicio
     * @param {Object} servicio - Objeto servicio con datos
     * @returns {string} HTML de la tarjeta
     */
    function crearTarjetaServicio(servicio) {
        const icono = servicio.icono || 'bi-heart-pulse';
        const precioFormateado = formatearPrecio(servicio.precio);
        
        return `
            <div class="col-12 col-md-6 col-lg-3 aparecer-suave">
                <div class="card tarjeta-servicio">
                    <div class="icono-servicio">
                        <i class="bi ${icono}"></i>
                    </div>
                    <div class="card-body cuerpo-servicio">
                        <h3 class="titulo-servicio">${servicio.nombre}</h3>
                        <p class="descripcion-servicio">${servicio.descripcion}</p>
                        <div class="pie-servicio">
                            <div class="precio-servicio">
                                ${precioFormateado}
                                <small class="d-block">por sesión</small>
                            </div>
                            <a href="#reserva" class="boton-reservar">
                                Reservar <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Muestra un mensaje de error
     */
    function mostrarError() {
        mensajeCargando.classList.add('d-none');
        mensajeError.classList.remove('d-none');
        contenedorCatalogo.innerHTML = '';
    }

    /**
     * Oculta los mensajes de estado
     */
    function ocultarMensajes() {
        mensajeCargando.classList.add('d-none');
        mensajeError.classList.add('d-none');
    }

    /**
     * Renderiza todos los servicios en el catálogo
     * @param {Array} servicios - Array de servicios a renderizar
     */
    function renderizarServicios(servicios) {
        // Validar que haya servicios
        if (!servicios || servicios.length === 0) {
            mostrarError();
            console.warn('⚠️ No hay servicios disponibles para mostrar');
            return;
        }

        // Ocultar mensajes de estado
        ocultarMensajes();

        // Generar HTML para todas las tarjetas
        const htmlServicios = servicios
            .map(servicio => crearTarjetaServicio(servicio))
            .join('');

        // Insertar en el contenedor
        contenedorCatalogo.innerHTML = htmlServicios;

        // Log de éxito
        console.log(`✅ ${servicios.length} servicios renderizados correctamente`);

        // Agregar animación escalonada a las tarjetas
        agregarAnimacionEscalonada();
    }

    /**
     * Agrega animación escalonada a las tarjetas
     */
    function agregarAnimacionEscalonada() {
        const tarjetas = contenedorCatalogo.querySelectorAll('.aparecer-suave');
        tarjetas.forEach((tarjeta, indice) => {
            tarjeta.style.animationDelay = `${indice * 0.1}s`;
        });
    }

    /**
     * Carga los servicios desde LocalStorage
     */
    function cargarServicios() {
        try {
            console.log('📋 Cargando servicios desde LocalStorage...');

            // Simular un pequeño delay para mostrar el loading
            setTimeout(() => {
                // Obtener servicios del LocalStorage
                const serviciosTexto = localStorage.getItem('servicios');
                
                if (!serviciosTexto) {
                    console.error('❌ No se encontraron servicios en LocalStorage');
                    mostrarError();
                    return;
                }

                // Parsear JSON
                const servicios = JSON.parse(serviciosTexto);

                // Validar estructura de datos
                if (!Array.isArray(servicios)) {
                    console.error('❌ Los datos de servicios no son un array válido');
                    mostrarError();
                    return;
                }

                // Renderizar servicios
                renderizarServicios(servicios);

            }, 500); // Delay de 500ms para UX

        } catch (error) {
            console.error('❌ Error al cargar servicios:', error);
            mostrarError();
        }
    }

    /**
     * Inicialización cuando el DOM está listo
     */
    function inicializar() {
        // Verificar que los elementos del DOM existan
        if (!contenedorCatalogo) {
            console.error('❌ No se encontró el contenedor del catálogo');
            return;
        }

        // Cargar servicios
        cargarServicios();

        console.log('🐾 Módulo de Servicios inicializado correctamente');
    }

    /**
     * Exponer función de carga para uso externo
     */
    window.cargarServicios = cargarServicios;

    /**
     * Función de utilidad para debugging
     * Muestra los servicios en consola
     */
    window.verServicios = function() {
        try {
            const servicios = JSON.parse(localStorage.getItem('servicios'));
            console.table(servicios);
            return servicios;
        } catch (error) {
            console.error('Error al mostrar servicios:', error);
            return null;
        }
    };

    // Inicializar cuando el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        // DOM ya está listo
        inicializar();
    }

})();
