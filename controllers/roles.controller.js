const { response } = require('express');
const { pool } = require('../database/config');
//SECTION - OBTENER TODOS LOS ROLES ACTIVOS DENTRO DE LA BD
const obtenerRoles = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM roles WHERE estado_rol="activo"',
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
        roles: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - OBTENER EL ROL A TRAVES DE UN IDENTIFICADOR
const obtenerRolPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM roles WHERE id_rol = ? AND estado_rol="activo"',
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
              msg: 'No se ha encontrado el rol especificado',
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
        rol: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - CREAR UN NUEVO ROL
const crearRol = async (req, res = response) => {
  const rol = {
    nombre_rol: req.body.nombre_rol,
    estado_rol: 'activo',
  };

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query('INSERT INTO roles SET ?', rol, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
          return;
        }

        const { insertId } = result;

        resolve({ id_rol: insertId, ...rol });

        connection.release((error) => {
          if (error) console.log('Error al cerrar la conexión');
        });
      });
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        rol: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ACTUALIZAR UN ROL
const actualizarRolPorId = async (req, res = response) => {
  const id_rol = req.params.id;
  const { nombre_rol } = req.body;

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        ' UPDATE roles SET nombre_rol = ? WHERE id_rol = ? AND estado_rol="activo"',
        [nombre_rol, id_rol],
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
              msg: 'No se ha encontrado el rol',
            });
          }

          resolve({
            id_rol,
            nombre_rol,
            estado_rol: 'activo',
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
        rol: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ELIMINAR UN ROL
const eliminarRolPorId = async (req, res = response) => {
  const id_rol = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'UPDATE roles SET estado_rol = "inactivo" WHERE id_rol = ? AND estado_rol = "activo"',
        id_rol,
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
              msg: 'No se ha encontrado el rol',
            });
          }

          resolve({
            id_rol,
            msg: 'El rol ha sido eliminado correctamente',
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

/* -------------------------------------------------------------------------- */
/*                   FUNCIONES PARA VALIDAR ROLES EXISTENTES                  */
/* -------------------------------------------------------------------------- */
const existeRolPorNombre = async (nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM roles WHERE nombre_rol= ? AND estado_rol = "activo"`,
        nombre,
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

const existeRolPorNombreActualizable = async (id, nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM roles WHERE id_rol != ? AND nombre_rol= ? AND estado_rol = "activo"`,
        [id, nombre],
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
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRolPorId,
  eliminarRolPorId,
  existeRolPorNombre,
  existeRolPorNombreActualizable,
};
