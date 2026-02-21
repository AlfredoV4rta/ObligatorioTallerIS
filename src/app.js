
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
// GESTIÓN TURNOS - ADMIN
// ====================================

function crearTarjetaReserva(reserva) {
    const profesional = obtenerProfesionalPorId(reserva.profesional_id);
    const nombreProfesional = profesional ? profesional.nombre : 'No asignado';

    const telefono = reserva.telefono !== '' ? reserva.telefono : '-';
    const email = reserva.email !== '' ? reserva.email : '-';

    return `
        <div class="col-12 col-lg-6">
            <div class="card h-100 shadow-sm border-0 rounded-4 card-reserva">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="card-title mb-1">
                                <i class="bi bi-person-fill text-verde me-2"></i>${reserva.nombre_dueno}
                            </h5>
                            <p class="text-muted mb-0"><small>Mascota: ${reserva.nombre_mascota}</small></p>
                        </div>
                        <span class="badge bg-success">Confirmada</span>
                    </div>
                    <div class="mb-3">
                        <div class="info-item mb-2">
                            <i class="bi bi-calendar-event text-verde me-2"></i>
                            <strong>Fecha:</strong> ${reserva.fecha}
                        </div>
                        <div class="info-item mb-2">
                            <i class="bi bi-clock text-verde me-2"></i>
                            <strong>Hora:</strong> ${reserva.hora} (${reserva.duracion_minutos} min)
                        </div>
                        <div class="info-item mb-2">
                            <i class="bi bi-scissors text-verde me-2"></i>
                            <strong>Servicio:</strong> ${reserva.tipo_servicio}
                        </div>
                        <div class="info-item mb-2">
                            <i class="bi bi-person-badge text-verde me-2"></i>
                            <strong>Profesional:</strong> ${nombreProfesional}
                        </div>
                        <div class="info-item mb-2">
                            <i class="bi bi-telephone text-verde me-2"></i>
                            <strong>Teléfono:</strong> ${telefono}
                        </div>
                        <div class="info-item">
                            <i class="bi bi-envelope text-verde me-2"></i>
                            <strong>Email:</strong> ${email}
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-danger flex-grow-1" onclick="manejarCancelarReserva(${reserva.id})">
                            <i class="bi bi-trash me-2"></i>Cancelar Turno
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function cargarReservasAdmin() {
    const listaReservas = document.getElementById('listaReservas');
    const mensajeSinReservas = document.getElementById('mensajeSinReservas');

    if (!listaReservas) {
        return;
    }

    const reservas = obtenerReservasOrdenadas();

    if (reservas.length === 0) {
        listaReservas.innerHTML = '';
        mensajeSinReservas.classList.remove('d-none');
        return;
    }

    mensajeSinReservas.classList.add('d-none');

    let html = '';
    for (let i = 0; i < reservas.length; i++) {
        html += crearTarjetaReserva(reservas[i]);
    }

    listaReservas.innerHTML = html;
}

function manejarCancelarReserva(id) {
    const resultado = eliminarReserva(id);

    if (resultado.exito === true) {
        alert('Reserva cancelada exitosamente');
        cargarReservasAdmin();
    } else {
        alert('Error al cancelar la reserva: ' + resultado.mensaje);
    }
}

// ====================================
// RESERVAS - FORMULARIO
// ====================================

function cargarServiciosEnSelect() {
    const selectServicio = document.getElementById('tipoServicio');
    if (!selectServicio) {
        return;
    }

    const servicios = obtenerServicios();

    let opciones = '<option value="">Selecciona un servicio</option>';

    for (let i = 0; i < servicios.length; i++) {
        opciones += '<option value="' + servicios[i].nombre + '">' + servicios[i].nombre + ' - $' + servicios[i].precio + '</option>';
    }

    selectServicio.innerHTML = opciones;
}

function cargarProfesionalesEnSelect() {
    const selectProfesional = document.getElementById('profesional');
    const servicioSeleccionado = document.getElementById('tipoServicio');

    let servicio = servicioSeleccionado.value;

    if (!selectProfesional) {
        return;
    }

    const profesionales = obtenerProfesionales();

    let opciones = '<option value="">Asignación automática</option>';

    if (servicio === '') {
        selectProfesional.disabled = true;
        selectProfesional.innerHTML = '<option value="">Primero selecciona un servicio</option>';
        return;
    }

    selectProfesional.disabled = false;

    if (servicio !== 'Estética y baño') {
        for (let i = 0; i < profesionales.length - 1; i++) {
            opciones += '<option value="' + profesionales[i].id + '">' + profesionales[i].nombre + ' - ' + profesionales[i].tipo + '</option>';
        }
    } else {
        for (let i = 0; i < profesionales.length; i++) {
            opciones += '<option value="' + profesionales[i].id + '">' + profesionales[i].nombre + ' - ' + profesionales[i].tipo + '</option>';
        }
    }

    selectProfesional.innerHTML = opciones;
}

function obtenerFechaMinima() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    return hoy.toISOString().split('T')[0];
}

function cargarHorariosDisponibles() {
    const selectServicio = document.getElementById('tipoServicio');
    const inputFecha = document.getElementById('fecha');
    const selectHora = document.getElementById('hora');
    const selectProfesional = document.getElementById('profesional');

    const servicio = selectServicio.value;
    const fecha = inputFecha.value;

    if (servicio === '' || fecha === '') {
        selectHora.disabled = true;
        selectHora.innerHTML = '<option value="">Primero selecciona un servicio y fecha</option>';
        return;
    }

    const validacionFecha = esFechaValida(fecha);
    if (validacionFecha.valido === false) {
        alert(validacionFecha.mensaje);
        inputFecha.value = '';
        return;
    }

    const valorProfesional = selectProfesional.value;
    let profesionalId = null;

    if (valorProfesional !== '') {
        profesionalId = parseInt(valorProfesional);
    }

    const horarios = obtenerHorariosDisponibles(servicio, fecha, profesionalId);

    selectHora.disabled = false;

    let opciones = '<option value="">Selecciona un horario</option>';

    if (horarios.length === 0) {
        selectHora.innerHTML = '<option value="">No hay horarios disponibles</option>';
        selectHora.disabled = true;
        return;
    }

    for (let i = 0; i < horarios.length; i++) {
        opciones += '<option value="' + horarios[i] + '">' + horarios[i] + '</option>';
    }

    selectHora.innerHTML = opciones;
}

function manejarEnvioReserva(e) {
    e.preventDefault();

    const nombreDueno = document.getElementById('nombreDueno').value.trim();
    const nombreMascota = document.getElementById('nombreMascota').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipoServicio = document.getElementById('tipoServicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const valorProfesional = document.getElementById('profesional').value;

    let profesionalId = null;
    if (valorProfesional !== '') {
        profesionalId = parseInt(valorProfesional);
    }

    const datos = {
        nombre_dueno: nombreDueno,
        nombre_mascota: nombreMascota,
        telefono: telefono,
        email: email,
        tipo_servicio: tipoServicio,
        fecha: fecha,
        hora: hora,
        profesional_id: profesionalId
    };

    const resultado = crearReserva(datos);

    if (resultado.exito === true) {
        alert('¡Reserva confirmada exitosamente!');
        document.getElementById('formReserva').reset();

        const selectHora = document.getElementById('hora');
        selectHora.disabled = true;
        selectHora.innerHTML = '<option value="">Primero selecciona un servicio y fecha</option>';
    } else {
        let mensajeError = 'Error al crear la reserva:\n';
        for (let i = 0; i < resultado.errores.length; i++) {
            mensajeError += resultado.errores[i] + '\n';
        }
        alert(mensajeError);
    }
}

function inicializarFormularioReservas() {
    const form = document.getElementById('formReserva');
    if (!form) {
        return;
    }

    cargarServiciosEnSelect();
    cargarProfesionalesEnSelect();

    const inputFecha = document.getElementById('fecha');
    inputFecha.min = obtenerFechaMinima();

    const selectServicio = document.getElementById('tipoServicio');
    selectServicio.addEventListener('change', function () {
        cargarHorariosDisponibles();
        cargarProfesionalesEnSelect();
    });

    const selectFecha = document.getElementById('fecha');
    selectFecha.addEventListener('change', cargarHorariosDisponibles);

    const selectProfesional = document.getElementById('profesional');
    selectProfesional.addEventListener('change', cargarHorariosDisponibles);



    form.addEventListener('submit', manejarEnvioReserva);
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
                        <a href="#reservar" class="boton-reservar">
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
    //Solo ejecutar si los elementos existen
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
    inicializarFormularioReservas();
    cargarReservasAdmin();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}