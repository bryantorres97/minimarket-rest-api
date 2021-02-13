const { response } = require('express');
const { pool } = require('../database/config');

//SECTION - OBTENER TODOS LOS PRODUCTOS ACTIVOS DENTRO DE LA BD
const obtenerProdcutos = async (req, res = response) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM productos WHERE estado_producto="activo"',
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
        productos: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - OBTENER EL PRODUCTO A TRAVES DE UN IDENTIFICADOR
const obtenerProductoPorId = async (req, res = response) => {
  const id = req.params.id;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        'SELECT * FROM productos WHERE id_producto = ? AND estado_producto="activo"',
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
              msg: 'No se ha encontrado el prodcuto especificado',
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
        producto: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - CREAR UN NUEVO PRODUCTO
const crearProducto = async (req, res = response) => {
  const producto = {
    nombre_producto: req.body.nombre_producto,
    descripcion_producto: req.body.descripcion_producto,
    precio_producto: req.body.precio_producto,
    precio_v_producto: req.body.precio_v_producto,
    stock_producto: req.body.stock_producto,
    codigo_producto: req.body.codigo_producto,
    id_percha_per: req.body.id_percha_per,
    foto_producto: '',
    estado_producto: 'activo',
  };

  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query('INSERT INTO productos SET ?', producto, (error, result) => {
        if (error) {
          reject({
            code: 502,
            msg: 'No se puede ejecutar su petición en este momento',
          });
          return;
        }

        const { insertId } = result;

        resolve({ id_producto: insertId, ...producto });

        connection.release((error) => {
          if (error) console.log('Error al cerrar la conexión');
        });
      });
    });
  })
    .then((result) =>
      res.json({
        ok: true,
        producto: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ACTUALIZAR UN PRODUCTO
const actualizarProductoPorId = async (req, res = response) => {
  const id_producto = req.params.id;
  const {
    nombre_producto,
    descripcion_producto,
    precio_producto,
    precio_v_producto,
    stock_producto,
    codigo_producto,
    // foto_producto,
    id_percha_per,
  } = req.body;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `UPDATE productos 
        SET nombre_producto = ?, descripcion_producto=?, precio_producto=?, precio_v_producto=?, 
            stock_producto=?, codigo_producto=?,  id_percha_per=?  
        WHERE id_producto = ? AND estado_producto="activo"`,
        [
          nombre_producto,
          descripcion_producto,
          precio_producto,
          precio_v_producto,
          stock_producto,
          codigo_producto,
          id_percha_per,
          id_producto,
        ],
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
              msg: 'No se ha encontrado el producto',
            });
          }

          resolve({
            id_producto,
            nombre_producto,
            descripcion_producto,
            precio_producto,
            precio_v_producto,
            stock_producto,
            codigo_producto,
            id_percha_per,
            estado_producto: 'activo',
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
        producto: result,
      })
    )
    .catch((error) =>
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      })
    );
};

// SECTION - ELIMINAR UN PRODUCTO
const eliminarProductoPorId = async (req, res = response) => {
  const id_producto = req.params.id;
  return await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }
      connection.query(
        'UPDATE productos SET estado_producto = "inactivo" WHERE id_producto = ? AND estado_producto= "activo"',
        id_producto,
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
              msg: 'No se ha encontrado el producto',
            });
          }

          resolve({
            id_producto,
            msg: 'El producto ha sido eliminado correctamente',
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
/*                 FUNCIONES PARA VALIDAR PRODUCTOS EXISTENTES                */
/* -------------------------------------------------------------------------- */

const existeProductoPorNombre = async (nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM productos WHERE nombre_producto= ? AND estado_producto = "activo"`,
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

const existeProductoPorNombreActualizable = async (id, nombre) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT * FROM productos WHERE id_producto= ? nombre_producto= ? AND estado_producto = "activo"`,
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
  obtenerProdcutos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProductoPorId,
  eliminarProductoPorId,
  existeProductoPorNombre,
  existeProductoPorNombreActualizable,
};
