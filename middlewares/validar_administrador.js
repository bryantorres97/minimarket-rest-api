const { response } = require('express');
const { existeUsuarioPorCedula } = require('../controllers/usuarios.controller');
const { pool } = require('../database/config');

const validarAdministrador = async (req, res = response, next) => {
  const id_usuario = req.params.id;

  try {
    const { nombre_rol } = await obtenerRolUsuario(id_usuario);
    if (nombre_rol == 'Administrador') {
      const { cantidadAdmins } = await obtenerCantidadAdministradores();
      if (cantidadAdmins <= 1) {
        return res.status(400).json({
          ok: false,
          msg: 'Debe de existir al menos un administrador en el sistema',
        });
      }
    }

    next();
  } catch (error) {
    return res.status(error.code).json({
      ok: false,
      msg: error.msg,
    });
  }
};

const validarAdministradorActualizar = async (req, res = response, next) => {
  const { id_rol_pertenece } = req.body;
  const id_usuario = req.params.id;

  try {
    const usuario = await obtenerRolUsuario(id_usuario);
    if (
      usuario.nombre_rol == 'Administrador' &&
      usuario.id_rol_pertenece != id_rol_pertenece
    ) {
      const { cantidadAdmins } = await obtenerCantidadAdministradores();
      if (cantidadAdmins <= 1) {
        return res.status(400).json({
          ok: false,
          msg: 'Debe de existir al menos un administrador en el sistema',
        });
      }
    }
    next();
  } catch (error) {}
};

const obtenerCantidadAdministradores = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        ` SELECT COUNT(id_usuario) as cantidadAdmins
          FROM usuarios
          INNER JOIN roles
          ON usuarios.id_rol_pertenece = roles.id_rol
          WHERE estado_usuario='activo' AND roles.nombre_rol='Administrador' AND roles.estado_rol='activo'`,
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }
          resolve(result[0]);
          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  });
};

const obtenerRolUsuario = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT nombre_usuario, nombre_rol, id_rol_pertenece 
        FROM usuarios 
        INNER JOIN roles
        ON usuarios.id_rol_pertenece = roles.id_rol
        WHERE id_usuario = ? AND roles.estado_rol='activo' AND estado_usuario='activo'`,
        id_usuario,
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }
          if (result.length == 0) {
            reject({
              code: 402,
              msg: 'No se ha encontrado el usuario especificado',
            });
            return;
          }

          resolve(result[0]);
          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  });
};

module.exports = { validarAdministrador, validarAdministradorActualizar };
