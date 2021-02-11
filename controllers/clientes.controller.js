const { response } = require('express');
const { pool } = require('../database/config');

/* -------------------------------------------------------------------------- */
/*                        FUNCIONES PARA LOS SERVICIOS                        */
/* -------------------------------------------------------------------------- */

// SECTION OBTENER TODOS LOS CLIENTES ACTIVOS DENTRO DE LA BD
const obtenerClientes = async (req, res = response) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM clientes WHERE estado_cliente="activo"',
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
        clientes: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION OBTENER EL CLIENTE A TRAVES DE UN IDENTIFICADOR
const obtenerClientePorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM clientes WHERE id_cliente = ? AND estado_cliente="activo"',
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
              msg: 'No se ha encontrado el cliente especificado',
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
        cliente: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION CREAR CLIENTE
const crearCliente = async (req, res = response) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
      }

      let cliente = {
        nombre_cliente: req.body.nombre_cliente,
        apellido_cliente: req.body.apellido_cliente,
        cedula_cliente: req.body.cedula_cliente,
        direccion_cliente: req.body.direccion_cliente,
        telefono_cliente: req.body.telefono_cliente,
        estado_cliente: 'activo',
      };

      connection.query('INSERT INTO clientes SET ?', cliente, (error, result) => {
        if (error) {
          console.log(error);
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
        }

        cliente = { id_cliente: result.insertId, ...cliente };

        resolve(cliente);
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
        cliente: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION ACTUALIZAR UN CLIENTE
const actualizarClientePorId = async (req, res = response) => {
  const id_cliente = req.params.id;
  return await new Promise((resolve, reject) => {
    const {
      nombre_cliente,
      apellido_cliente,
      cedula_cliente,
      direccion_cliente,
      telefono_cliente,
    } = req.body;
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `UPDATE clientes 
         SET nombre_cliente = ?, apellido_cliente=?, cedula_cliente=?, direccion_cliente=?, telefono_cliente=?  
         WHERE id_cliente = ? AND estado_cliente="activo"`,
        [
          nombre_cliente,
          apellido_cliente,
          cedula_cliente,
          direccion_cliente,
          telefono_cliente,
          id_cliente,
        ],
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
              msg: 'No se ha encontrado el cliente',
            });
          }

          resolve({
            id_cliente,
            nombre_cliente,
            apellido_cliente,
            cedula_cliente,
            direccion_cliente,
            telefono_cliente,
            estado_cliente: 'activo',
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
        cliente: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION ELIMINAR UN CLIENTE
const eliminarClientePorId = async (req, res = response) => {
  const id_cliente = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'UPDATE clientes SET estado_cliente = "inactivo" WHERE id_cliente = ? AND estado_cliente= "activo"',
        id_cliente,
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
              msg: 'No se ha encontrado el cliente',
            });
          }

          resolve({
            id_cliente,
            msg: 'El cliente ha sido eliminado correctamente',
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
/*                 FUNCIONES PARA VALIDAR CLIENTES EXISTENTES                 */
/* -------------------------------------------------------------------------- */

// SECTION VERIFICAR SI EXISTE UN CLIENTE
const existeClientePorCedula = async (cedula) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM clientes WHERE cedula_cliente= ? AND estado_cliente = "activo"`,
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

const existeClientePorCedulaActualizable = async (id, cedula) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM clientes 
        WHERE id_cliente != ? AND cedula_cliente= ? AND estado_cliente = "activo"`,
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
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarClientePorId,
  eliminarClientePorId,
  existeClientePorCedula,
  existeClientePorCedulaActualizable,
};
