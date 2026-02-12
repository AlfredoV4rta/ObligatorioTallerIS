
// ====================================
// ELEMENTOS DEL DOM
// ====================================

const elementos = {
    // Servicios
    catalogoServicios: document.getElementById('catalogoServicios'),
    mensajeCargando: document.getElementById('mensajeCargando'),
    mensajeError: document.getElementById('mensajeError'),

    // Profesionales
    listaProfesionales: document.getElementById('lista-profesionales'),
    botonesFiltro: document.querySelectorAll('.filtro-btn'),
    countBadge: document.getElementById('count-badge'),

    //Usuarios
    botonLogin: document.querySelector("#btnLogin")
};

// ====================================
// LOGIN
// ====================================

function login() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let mensaje = "";

    if (username === "" || password === "") {
        mensaje = "Complete todos los campos"
        alert(mensaje);
        return
    }

    let validacion = validarUsuario(username, password);

    if (validacion.valido) {
        window.location.href = "gestionTurnos.html";
    } else {
        alert(validacion.estado);
    }
}

// ====================================
// SERVICIOS - FUNCIONES DE RENDERIZADO
// ====================================

function crearTarjetaServicio(servicio) {
    const icono = servicio.icono || 'bi-heart-pulse';

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
                            $${servicio.precio}
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

function mostrarErrorServicios() {
    elementos.mensajeCargando.classList.add('d-none');
    elementos.mensajeError.classList.remove('d-none');
    elementos.catalogoServicios.innerHTML = '';
}

function ocultarMensajesServicios() {
    elementos.mensajeCargando.classList.add('d-none');
    elementos.mensajeError.classList.add('d-none');
}

function agregarAnimacionEscalonada() {
    const tarjetas = elementos.catalogoServicios.querySelectorAll('.aparecer-suave');
    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.style.animationDelay = `${indice * 0.1}s`;
    });
}

function renderizarServicios(servicios) {
    if (!servicios || servicios.length === 0) {
        mostrarErrorServicios();
        return;
    }

    ocultarMensajesServicios();

    const htmlServicios = servicios
        .map(servicio => crearTarjetaServicio(servicio))
        .join('');

    elementos.catalogoServicios.innerHTML = htmlServicios;
    agregarAnimacionEscalonada();
}

function cargarServicios() {
    if (!elementos.catalogoServicios) {
        console.error('No se encontró el contenedor del catálogo');
        return;
    }

    setTimeout(() => {
        const servicios = obtenerServicios();
        renderizarServicios(servicios);
    }, 500);
}

// ====================================
// PROFESIONALES - FUNCIONES DE RENDERIZADO
// ====================================

function crearTarjetaProfesional(prof) {
    const serviciosHTML = prof.servicios
        .map(s => `<span class="servicio-tag">${s}</span>`)
        .join('');

    return `
        <div class="col-12 col-sm-6 col-lg-3 mb-4">
            <div class="card card-profesional h-100 shadow-sm">
                <div class="card-img-wrapper">
                    <img
                        src="${prof.foto}"
                        class="card-img-top prof-foto"
                        alt="Foto de ${prof.nombre}"
                        onerror="this.src='img/avatar-default.png'; this.onerror=null;"
                    />
                    <span class="badge-tipo ${getBadgeClass(prof.tipo)}">
                        ${prof.tipo}
                    </span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title prof-nombre">${prof.nombre}</h5>
                    <p class="prof-especialidad">${prof.especialidad}</p>
                    <p class="prof-bio">"${prof.bio}"</p>
                    <p class="prof-servicios-label">Servicios:</p>
                    <div class="servicios-container">
                        ${serviciosHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function actualizarContadorProfesionales(cantidad) {
    if (elementos.countBadge) {
        elementos.countBadge.textContent = `${cantidad} profesionales`;
    }
}

function renderizarProfesionales(profesionales) {
    if (!elementos.listaProfesionales) return;

    if (profesionales.length === 0) {
        elementos.listaProfesionales.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay profesionales disponibles en este momento.</p>
            </div>`;
        actualizarContadorProfesionales(0);
        return;
    }

    const html = profesionales
        .map(prof => crearTarjetaProfesional(prof))
        .join('');

    elementos.listaProfesionales.innerHTML = html;
    actualizarContadorProfesionales(profesionales.length);
}

function cargarProfesionales() {
    const profesionales = obtenerProfesionales();
    renderizarProfesionales(profesionales);
}

// ====================================
// USUARIOS - CARGA LOCALSTORAGE
// ====================================

function cargarUsuarios() {
    obtenerUsuarios();
}

// ====================================
// EVENT LISTENERS
// ====================================

function manejarCambioFiltro(botonClickeado) {
    elementos.botonesFiltro.forEach(boton =>
        boton.classList.remove('active')
    );
    botonClickeado.classList.add('active');

    const tipo = botonClickeado.dataset.tipo;
    const profesionalesFiltrados = filtrarProfesionalesPorTipo(tipo);
    renderizarProfesionales(profesionalesFiltrados);
}

function inicializarEventListenersProf() {
    elementos.botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function () {
            manejarCambioFiltro(this);
        });
    });
}

function inicializarEventListenerUsuarios() {
    if (elementos.botonLogin) {
        elementos.botonLogin.addEventListener("click", login);
    }
}

// ====================================
// INICIALIZACIÓN
// ====================================

function inicializar() {
    // ✅ Solo ejecutar si los elementos existen
    if (elementos.catalogoServicios) {
        cargarServicios();
    }
    
    if (elementos.listaProfesionales) {
        cargarProfesionales();
    }
    
    // Siempre cargar usuarios (necesario para login)
    cargarUsuarios();
    
    if (elementos.botonesFiltro.length > 0) {
        inicializarEventListenersProf();
    }
    
    inicializarEventListenerUsuarios();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}