const STORAGE_KEY_PROFESIONALES = "vh_profesionales";

const profesionalesIniciales = [
  {
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
  },
];

function inicializarProfesionales() {
  if (!localStorage.getItem(STORAGE_KEY_PROFESIONALES)) {
    localStorage.setItem(STORAGE_KEY_PROFESIONALES, JSON.stringify(profesionalesIniciales));
  }
}

function obtenerProfesionales() {
  inicializarProfesionales();
  const data = localStorage.getItem(STORAGE_KEY_PROFESIONALES);
  return data ? JSON.parse(data) : [];
}

function obtenerProfesionalPorId(id) {
  const profesionales = obtenerProfesionales();
  return profesionales.find(prof => prof.id === id) || null;
}

function filtrarProfesionalesPorTipo(tipo) {
  const profesionales = obtenerProfesionales();

  if (tipo === "todos") {
    return profesionales;
  }

  if (tipo === "veterinario") {
    return profesionales.filter(p => p.tipo.toLowerCase().includes("veterinari"));
  }

  if (tipo === "estilista") {
    return profesionales.filter(p => p.tipo.toLowerCase().includes("estética"));
  }

  return profesionales;
}

function getBadgeClass(tipo) {
  const t = tipo.toLowerCase();
  return t.includes("veterinari") ? "badge-vet" : "badge-estilista";
}

module.exports = obtenerProfesionales;

