const { response } = require('express');
const { pool } = require('../database/config');
//SECTION - OBTENER TODOS LOS PASILLOS ACTIVOS DENTRO DE LA BD
const obtenerPasillos = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM pasillos WHERE estado_pasillo="activo"',
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
        pasillos: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

//!SECTION

// SECTION - OBTENER EL PASILLO A TRAVES DE UN IDENTIFICADOR
const obtenerPasilloPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM pasillos WHERE id_pasillo = ? AND estado_pasillo="activo"',
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
              msg: 'No se ha encontrado el pasillo especificado',
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
        pasillo: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};
//!SECTION

// SECTION - CREAR UN NUEVO PASILLO
const crearPasillo = async (req, res = response) => {
  const pasillo = {
    nombre_pasillo: req.body.nombre_pasillo,
    descripcion_pasillo: req.body.descripcion_pasillo,
    estado_pasillo: 'activo',
  };

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query('INSERT INTO pasillos SET ?', pasillo, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
          return;
        }

        const { insertId } = result;

        resolve({ id_pasillo: insertId, ...pasillo });

        connection.release((error) => {
          if (error) console.log('Error al cerrar la conexión');
        });
      });
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        pasillo: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};
//!SECTION

// SECTION - ACTUALIZAR UN PASILLO
const actualizarPasilloPorId = async (req, res = response) => {
  const id_pasillo = req.params.id;
  const { nombre_pasillo, descripcion_pasillo } = req.body;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
      }

      connection.query(
        `UPDATE pasillos 
        SET nombre_pasillo = ?, descripcion_pasillo=? 
        WHERE id_pasillo = ? AND estado_pasillo="activo"`,
        [nombre_pasillo, descripcion_pasillo, id_pasillo],
        (error, result) => {
          if (error) {
            console.log(error);
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
          }

          if (result.affectedRows == 0) {
            reject({
              code: 404,
              msg: 'No se ha encontrado el pasillo',
            });
          }

          resolve({
            id_pasillo,
            nombre_pasillo,
            descripcion_pasillo,
            estado_cliente: 'activo',
          });

          connection.release((error) => {
            if (error) {
              reject({ code: 502, msg: 'No se puede cerrar la conexión' });
            }
          });
        }
      );
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        pasillo: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};
//!SECTION

// SECTION - ELIMINAR UN PASILLO
const eliminarPasilloPorId = async (req, res = response) => {
  const id_pasillo = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'UPDATE pasillos SET estado_pasillo = "inactivo" WHERE id_pasillo = ? AND estado_pasillo= "activo"',
        id_pasillo,
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
              msg: 'No se ha encontrado el pasillo',
            });
          }

          resolve({
            id_pasillo,
            msg: 'El pasillo ha sido eliminado correctamente',
          });

          connection.release((error) => {
            if (error) {
              reject({ code: 502, msg: 'No se puede cerrar la conexión' });
            }
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
//!SECTION

/* -------------------------------------------------------------------------- */
/*                 FUNCIONES PARA VALIDAR PASILLOS EXISTENTES                 */
/* -------------------------------------------------------------------------- */

const existePasilloPorNombre = async (nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM pasillos WHERE nombre_pasillo= ? AND estado_pasillo = "activo"`,
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

const existePasilloPorNombreActualizable = async (id, nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM pasillos WHERE id_pasillo != ? AND nombre_pasillo = ? AND estado_pasillo = "activo"`,
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
  obtenerPasillos,
  obtenerPasilloPorId,
  crearPasillo,
  actualizarPasilloPorId,
  eliminarPasilloPorId,
  existePasilloPorNombre,
  existePasilloPorNombreActualizable,
};
