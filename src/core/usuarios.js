const STORAGE_KEY_USUARIOS = "vh_usuarios";

const usuariosIniciales = [
  {
    uName: "Fede",
    password: "1234"
  },
  {
    uName: "Julian",
    password: "1234"
  },
  {
    uName: "Alfredo",
    password: "1234"
  },
  {
    uName: "Profe",
    password: "1234"
  }
];

function inicializarUsuarios() {
    const usuariosGuardados = localStorage.getItem(STORAGE_KEY_USUARIOS);
    if (!usuariosGuardados) {
        localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuariosIniciales));
    }

    console.log("Usuarios inicializados");
}

function obtenerUsuarios() {
    inicializarUsuarios();
    const usuariosTexto = localStorage.getItem(STORAGE_KEY_USUARIOS);

    if (!usuariosTexto) return [];

    const usuarios = JSON.parse(usuariosTexto);
    return Array.isArray(usuarios) ? usuarios : [];
}

function obtenerUsuarioPorUsername(uName) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.uName === uName) || null;
}

function validarUsuario(pUserName, pPassword) {
    let mensaje = "";
    let usuario = obtenerUsuarioPorUsername(pUserName);
    let validacion = usuario !== null && usuario.password === pPassword;

    if(!validacion) {
        mensaje = "Credenciales invalidas";
    }

    return {
        valido : validacion,
        estado : mensaje
    }
}

module.exports = {inicializarUsuarios, obtenerUsuarios, obtenerUsuarioPorUsername, validarUsuario};

