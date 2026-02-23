
const {inicializarUsuarios, obtenerUsuarios, obtenerUsuarioPorUsername, validarUsuario} = require('../src/core/usuarios');


test('validacion denegada dos credenciales invalidas', () => {
    inicializarUsuarios();
    obtenerUsuarios();

    expect(validarUsuario('roberto', "123123")).toStrictEqual({valido:false, estado:"Credenciales invalidas"});
})

test('validacion denegada una credencial ok, otra mal', () => {
    inicializarUsuarios();
    obtenerUsuarios();

    expect(validarUsuario('Alfredo', "123123")).toStrictEqual({valido:false, estado:"Credenciales invalidas"});
})

test('validacion procesada correctamente', () => {
    inicializarUsuarios();
    obtenerUsuarios();

    expect(validarUsuario('Alfredo', "1234")).toStrictEqual({valido:true, estado:""});
})