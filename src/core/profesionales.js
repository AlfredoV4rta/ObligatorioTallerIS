// ============================================================
// profesionales.js - Veterinaria Huellas
// Gestión de profesionales con LocalStorage
// ============================================================
localStorage.removeItem("vh_profesionales"); // ⚠️ Sacar cuando los datos sean definitivos

const STORAGE_KEY = "vh_profesionales";

// Datos iniciales (seed) — se cargan solo si LocalStorage está vacío
const profesionalesIniciales = [
  {
    id: 1,
    nombre: "Dra. Sofía Pereira",
    tipo: "Veterinaria",
    foto: "img/mujer1.png",
    especialidad: "Clínica general y medicina preventiva (vacunas, controles)",
    bio: "Me enfoco en prevenir problemas antes de que aparezcan y en explicar todo de forma clara.",
    servicios: ["Clínica general", "Vacunas", "Controles preventivos", "Medicina preventiva"],
  },
  {
    id: 2,
    nombre: "Dr. Martín Rodríguez",
    tipo: "Veterinario",
    foto: "img/hombre1.png",
    especialidad: "Cirugía menor (castraciones) y urgencias",
    bio: "Trabajo con procedimientos seguros y un seguimiento postoperatorio cercano.",
    servicios: ["Cirugía menor", "Castraciones", "Urgencias", "Postoperatorio"],
  },
  {
    id: 3,
    nombre: "Valentina López",
    tipo: "Estética y baño",
    foto: "img/mujer2.png",
    especialidad: "Baño, secado, corte higiénico y manejo de mascotas nerviosas",
    bio: "Prioridad: que la experiencia sea tranquila y sin estrés.",
    servicios: ["Baño y secado", "Corte higiénico", "Manejo amable", "Mascotas nerviosas"],
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
  const t = tipo.toLowerCase();
  return t.includes("veterinari") ? "badge-vet" : "badge-estilista";
}

function getIcono(tipo) {
  const t = tipo.toLowerCase();
  return t.includes("veterinari") ? "🩺" : "✂️";
}

function renderTarjetaProfesional(prof) {
  const serviciosHTML = prof.servicios
    .map((s) => `<span class="servicio-tag">${s}</span>`)
    .join("");

  return `
    <div class="col-12 col-sm-6 col-lg-4 mb-4">
      <div class="card card-profesional h-100 shadow-sm">
        <div class="card-img-wrapper">
          <img
            src="${prof.foto}"
            class="card-img-top prof-foto"
            alt="Foto de ${prof.nombre}"
            onerror="this.src='img/avatar-default.png'; this.onerror=null;"
          />
          <span class="badge-tipo ${getBadgeClass(prof.tipo)}">
            ${getIcono(prof.tipo)} ${prof.tipo}
          </span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title prof-nombre">${prof.nombre}</h5>
          <p class="prof-especialidad">⭐ ${prof.especialidad}</p>
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
      : profesionales.filter((p) => p.tipo.toLowerCase().includes(filtroActivo));

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
