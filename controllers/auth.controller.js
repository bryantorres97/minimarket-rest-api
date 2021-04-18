const { response } = require('express');
const { pool } = require('../database/config');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { cedula_usuario, clave_usuario } = req.body;

  try {
    const { nombre_rol, ...usuario } = await obtenerUsuarioPorCedula(cedula_usuario);
    const passwordValido = bcrypt.compareSync(clave_usuario, usuario.clave_usuario);

    if (!passwordValido) {
      return res.status(404).json({
        ok: false,
        msg: 'Cédula o contraseña incorrectos',
      });
    }
    const token = await generarJWT(usuario.id_usuario, cedula_usuario);

    res.json({
      ok: true,
      token,
      usuario,
      nombre_rol,
    });
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({
        ok: false,
        msg: error.msg,
      });
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Hubo un error',
      });
    }
  }
};

const renovarToken = async (req, res) => {
  const { id_usuario, cedula_usuario } = req;

  try {
    const token = await generarJWT(id_usuario, cedula_usuario);
    const { nombre_rol, ...usuario } = await obtenerUsuarioPorCedula(cedula_usuario);

    res.json({
      ok: true,
      token,
      usuario,
      nombre_rol,
    });
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({
        ok: false,
        msg: error.msg,
      });
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Hubo un error',
      });
    }
  }
};

const obtenerUsuarioPorCedula = async (cedula_usuario) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(async (error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT id_usuario, clave_usuario, nombre_usuario, cedula_usuario, nombre_rol 
        FROM usuarios
        INNER JOIN roles
        ON usuarios.id_rol_pertenece = roles.id_rol 
        WHERE cedula_usuario = ? AND estado_usuario="activo"`,
        cedula_usuario,
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
              code: 404,
              msg: 'Usuario o contraseña incorrectos',
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

module.exports = { login, renovarToken };
