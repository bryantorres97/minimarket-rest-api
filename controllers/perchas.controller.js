const { response } = require('express');
const { pool } = require('../database/config');

//SECTION - OBTENER TODAS LAS PERCHAS ACTIVAS DENTRO DE LA BD
const obtenerPerchas = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM perchas WHERE estado_percha="activo"',
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
        perchas: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - OBTENER LA PERCHA A TRAVES DE UN IDENTIFICADOR
const obtenerPerchaPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM perchas WHERE id_percha = ? AND estado_percha="activo"',
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
              msg: 'No se ha encontrado la percha especificada',
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
        percha: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - CREAR UNA NUEVA PERCHA
const crearPercha = async (req, res = response) => {
  const percha = {
    nombre_percha: req.body.nombre_percha,
    descripcion_percha: req.body.descripcion_percha,
    id_pasillo_per: req.body.id_pasillo_per,
    estado_percha: 'activo',
  };

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query('INSERT INTO perchas SET ?', percha, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
          return;
        }

        const { insertId } = result;

        resolve({ id_percha: insertId, ...percha });

        connection.release((error) => {
          if (error) console.log('Error al cerrar la conexión');
        });
      });
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        percha: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ACTUALIZAR UNA PERCHA
const actualizarPerchaPorId = async (req, res = response) => {
  const id_percha = req.params.id;
  const { nombre_percha, descripcion_percha, id_pasillo_per } = req.body;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `UPDATE perchas 
        SET nombre_percha = ?, descripcion_percha=?, id_pasillo_per=?  
        WHERE id_percha = ? AND estado_percha="activo"`,
        [nombre_percha, descripcion_percha, id_pasillo_per, id_percha],
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
              msg: 'No se ha encontrado la percha',
            });
          }

          resolve({
            id_percha,
            nombre_percha,
            descripcion_percha,
            id_pasillo_per,
            estado_percha: 'activo',
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
        percha: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ELIMINAR UNA PERCHA
const eliminarPerchaPorId = async (req, res = response) => {
  const id_percha = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'UPDATE perchas SET estado_percha = "inactivo" WHERE id_percha = ? AND estado_percha= "activo"',
        id_percha,
        (error, result) => {
          if (error) {
            console.log(error);
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
            return;
          }

          if (result.affectedRows == 0) {
            reject({
              code: 404,
              msg: 'No se ha encontrado la percha',
            });
          }

          resolve({
            id_percha,
            msg: 'La percha ha sido eliminada correctamente',
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

/* -------------------------------------------------------------------------- */
/*                  FUNCIONES PARA VALIDAR PERCHAS EXISTENTES                 */
/* -------------------------------------------------------------------------- */

const existePerchaPorNombre = async (nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM perchas WHERE nombre_percha= ? AND estado_percha = "activo"`,
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

const existePerchaPorNombreActualizable = async (id, nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM perchas WHERE id_percha != ? AND nombre_percha= ? AND estado_percha = "activo"`,
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
  obtenerPerchas,
  obtenerPerchaPorId,
  crearPercha,
  actualizarPerchaPorId,
  eliminarPerchaPorId,
  existePerchaPorNombre,
  existePerchaPorNombreActualizable,
};
