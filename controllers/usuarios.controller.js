const { response } = require('express');
const { pool } = require('../database/config');

const bcrypt = require('bcryptjs');

//SECTION - OBTENER LISTA DE USUARIOS
const obtenerUsuarios = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM usuarios WHERE estado_usuario="activo"',
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          resolve(result);

          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        usuarios: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//SECTION - OBTENER USUARIO POR ID
const obtenerUsuarioPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM usuarios WHERE id_usuario = ? AND estado_usuario="activo"',
        id,
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
          }

          resolve(result[0]);

          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        usuario: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//SECTION - CREAR UN NUEVO USUARIO
const crearUsuario = async (req, res = response) => {
  const usuario = {
    nombre_usuario: req.body.nombre_usuario,
    clave_usuario: req.body.clave_usuario,
    cedula_usuario: req.body.cedula_usuario,
    id_rol_pertenece: req.body.id_rol_pertenece,
    estado_usuario: 'activo',
  };

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      usuario.clave_usuario = bcrypt.hashSync(usuario.clave_usuario, salt);

      connection.query('INSERT INTO usuarios SET ?', usuario, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
          return;
        }
        const { insertId } = result;

        resolve({ id_usuario: insertId, ...usuario });

        connection.release((error) => {
          if (error) console.log('Error al cerrar la conexión');
        });
      });
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        usuario: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//SECTION - ACTUALIZAR UN USUARIO
const actualizarUsuarioPorId = async (req, res = response) => {
  const id_usuario = req.params.id;
  return await new Promise((resolve, reject) => {
    const { nombre_usuario, cedula_usuario, id_rol_pertenece } = req.body;

    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `UPDATE usuarios 
                          SET nombre_usuario = ?, cedula_usuario=?, id_rol_pertenece=? 
                          WHERE id_usuario = ?  AND estado_usuario="activo"`,
        [nombre_usuario, cedula_usuario, id_rol_pertenece, id_usuario],
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          if (result.affectedRows == 0) {
            reject({
              code: 404,
              msg: 'No se ha encontrado el usuario',
            });
          }

          resolve({
            id_usuario,
            nombre_usuario,
            cedula_usuario,
            id_rol_pertenece,
            estado_usuario: 'activo',
          });

          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        usuario: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//SECTION - ELIMINAR UN USUARIO
const eliminarUsuarioPorId = async (req, res = response) => {
  const id_usuario = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'UPDATE usuarios SET estado_usuario = "inactivo" WHERE id_usuario = ? AND estado_usuario="activo"',
        id_usuario,
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          if (result.affectedRows == 0) {
            reject({
              code: 404,
              msg: 'No se ha encontrado el usuario',
            });
          }

          resolve({
            id_usuario,
            msg: 'El usuario ha sido eliminado correctamente',
          });

          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        msg: result.msg,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//SECTION - CAMBIAR PASSWORD
const cambiarClave = async (req, res = response) => {
  const id_usuario = req.params.id;
  // console.log(req.id_usuario);
  if (req.id_usuario != id_usuario) {
    return res.status(400).json({
      ok: false,
      msg: 'No tiene permiso de cambiar la clave',
    });
  }
  return await new Promise((resolve, reject) => {
    const { clave_usuario } = req.body;

    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }
      const salt = bcrypt.genSaltSync(5);
      const clave_usuario_cifrada = bcrypt.hashSync(clave_usuario, salt);
      connection.query(
        `UPDATE usuarios 
                          SET clave_usuario = ? 
                          WHERE id_usuario = ?  AND estado_usuario="activo"`,
        [clave_usuario_cifrada, id_usuario],
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          if (result.affectedRows == 0) {
            reject({
              code: 404,
              msg: 'No se ha encontrado el usuario',
            });
            return;
          }

          resolve({
            id_usuario,
            clave_usuario: clave_usuario_cifrada,
            estado_usuario: 'activo',
          });

          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        usuario: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};
/* -------------------------------------------------------------------------- */
/*                 FUNCIONES PARA VALIDAR USUARIOS EXISTENTES                 */
/* -------------------------------------------------------------------------- */
const existeUsuarioPorCedula = async (cedula) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM usuarios WHERE cedula_usuario= ?  AND estado_usuario="activo"`,
        cedula,
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          resolve(result.length > 0);
          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  });
};

const existeUsuarioPorCedulaActualizable = async (id, cedula) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM usuarios WHERE id_usuario != ? AND cedula_usuario= ?  AND estado_usuario="activo"`,
        [id, cedula],
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          resolve(result.length > 0);
          connection.release((error) => {
            if (error) console.log('Error al cerrar la conexión');
          });
        }
      );
    });
  });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuarioPorId,
  eliminarUsuarioPorId,
  cambiarClave,
  existeUsuarioPorCedula,
  existeUsuarioPorCedulaActualizable,
};
