// ============================================================
// profesionales.js - Veterinaria Huellas
// Gestión de profesionales con LocalStorage
// ============================================================
localStorage.removeItem("vh_profesionales");
const STORAGE_KEY = "vh_profesionales";

// Datos iniciales (seed) — se cargan solo si LocalStorage está vacío
const profesionalesIniciales = [
  {
    id: 1,
    nombre: "Dra. Laura Méndez",
    tipo: "veterinario",
    foto: "img/mujer1.png", // reemplazá con tu imagen
    servicios: ["Consulta general", "Vacunación", "Cirugía menor", "Diagnóstico por imagen"],
  },
  {
    id: 2,
    nombre: "Dr. Martín Torres",
    tipo: "veterinario",
    foto: "img/hombre1.png",
    servicios: ["Consulta general", "Odontología veterinaria", "Desparasitación"],
  },
  {
    id: 3,
    nombre: "Sofía Ramírez",
    tipo: "estilista",
    foto: "img/mujer2.png",
    servicios: ["Baño y secado", "Corte de pelo", "Corte de uñas", "Limpieza de oídos"],
  },
  {
    id: 4,
    nombre: "Camila Ortega",
    tipo: "estilista",
    foto: "img/mujer3.png",
    servicios: ["Baño y secado", "Corte de pelo", "Desmanche de pelaje", "Perfumado"],
  },
];

// ── CRUD LocalStorage ──────────────────────────────────────

function getProfesionales() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function seedProfesionales() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profesionalesIniciales));
  }
}

// ── Render ──────────────────────────────────────────────────

function getBadgeClass(tipo) {
  return tipo === "veterinario" ? "badge-vet" : "badge-estilista";
}

function getIcono(tipo) {
  return tipo === "veterinario" ? "🩺" : "✂️";
}

function renderTarjetaProfesional(prof) {
  const serviciosHTML = prof.servicios
    .map((s) => `<span class="servicio-tag">${s}</span>`)
    .join("");

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
            ${getIcono(prof.tipo)} ${capitalizar(prof.tipo)}
          </span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title prof-nombre">${prof.nombre}</h5>
          <p class="prof-servicios-label">Servicios:</p>
          <div class="servicios-container">
            ${serviciosHTML}
          </div>
          <a href="#reservar" class="btn btn-reservar mt-auto">Reservar turno</a>
        </div>
      </div>
    </div>
  `;
}

function renderProfesionales() {
  seedProfesionales();
  const profesionales = getProfesionales();
  const contenedor = document.getElementById("lista-profesionales");

  if (!contenedor) return;

  if (profesionales.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted">No hay profesionales disponibles en este momento.</p>
      </div>`;
    return;
  }

  // Filtro activo
  const filtroActivo = document.querySelector(".filtro-btn.active")?.dataset.tipo || "todos";
  const filtrados =
    filtroActivo === "todos"
      ? profesionales
      : profesionales.filter((p) => p.tipo === filtroActivo);

  contenedor.innerHTML = filtrados.map(renderTarjetaProfesional).join("");
}

// ── Filtros ─────────────────────────────────────────────────

function initFiltros() {
  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filtro-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      renderProfesionales();
    });
  });
}

// ── Capitalizar helper ───────────────────────────────────────

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Init ────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderProfesionales();
  initFiltros();
});
