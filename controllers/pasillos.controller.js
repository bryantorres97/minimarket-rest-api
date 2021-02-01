const { response } = require('express');
const { pool } = require('../database/config');
//SECTION - OBTENER TODOS LOS PASILLOS ACTIVOS DENTRO DE LA BD
const obtenerPasillos = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
      }

      connection.query(
        'SELECT * FROM pasillos WHERE estado_pasillo="activo"',
        (error, result) => {
          if (error) {
            reject({
              code: 502,
              msg: 'No se puede ejecutar su petición en este momento',
            });
          }

          resolve(result);

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

// SECTION - OBTENER EL PASILLO A TRAVES DE UN IDENTIFICADOR
const obtenerPasilloPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
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
          }

          if (result.length == 0) {
            reject({
              code: 402,
              msg: 'No se ha encontrado el pasillo especificado',
            });
          }

          resolve(result[0]);

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
      }

      connection.query('INSERT INTO pasillos SET ?', pasillo, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
        }

        const { insertId } = result;

        resolve({ id_pasillo: insertId, ...pasillo });

        connection.release((error) => {
          if (error) {
            reject({ code: 502, msg: 'No se puede cerrar la conexión' });
          }
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

// SECTION - ELIMINAR UN PASILLO
const eliminarPasilloPorId = async (req, res = response) => {
  const id_pasillo = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
      }

      connection.query(
        'UPDATE pasillos SET estado_pasillo = "inactivo" WHERE id_pasillo = ? AND estado_pasillo= "activo"',
        id_pasillo,
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

module.exports = {
  obtenerPasillos,
  obtenerPasilloPorId,
  crearPasillo,
  actualizarPasilloPorId,
  eliminarPasilloPorId,
};
