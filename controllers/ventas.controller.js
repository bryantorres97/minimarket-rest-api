const { response } = require('express');
const { pool } = require('../database/config');

const crearVenta = async (req, res = response) => {
  const { productos, id_cliente_per, ruc_venta } = req.body;
  let listaProductos = [];
  try {
    // Obteniendo datos de los productos
    for (const producto of productos) {
      let nuevoProducto = await obtenerProductoPorId(producto.id_producto);
      nuevoProducto.cantidad = producto.cantidad;
      listaProductos = [...listaProductos, nuevoProducto];
    }

    // Calculando subtotal e iva
    const subtotal = listaProductos.reduce(
      (valor_anterior, valor_actual) =>
        valor_anterior + valor_actual.precio_v_producto * valor_actual.cantidad,
      0
    );
    const iva = subtotal * Number(process.env.IVA);

    // Creando el objeto de venta
    const venta = {
      productos: listaProductos,
      // TODO Borrar luego de revisar que el trigger funcione
      fecha_venta: '2021-01-01',
      // TODO poner el ruc de la tienda
      ruc_venta: 123,
      subtotal_venta: subtotal,
      iva_venta: iva,
      // TODO Borrar luego de revisar que el trigger funcione
      total_venta: subtotal + iva,

      id_usuario_per: req.id_usuario,
      id_cliente_per,
      // TODO Cambiar a activo
      estado_venta: 'activo',
    };

    const ventaRealizada = await insertarVenta(venta);

    return res.json({
      ok: true,
      venta: ventaRealizada,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.msg,
    });
  }
};

const obtenerProductoPorId = async (id_producto) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      connection.query(
        `SELECT id_producto, nombre_producto, precio_v_producto, stock_producto, codigo_producto 
            FROM productos 
            WHERE id_producto = ? AND estado_producto="activo"`,
        id_producto,
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
  });
};

const insertarVenta = async (venta) => {
  let { productos, ...cabecera } = venta;
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({ code: 500, msg: 'No se ha podido establecer conexión' });
        return;
      }

      console.log('Conexion establecida: ', connection.threadId);
      // Iniciando transaccion
      connection.beginTransaction((error) => {
        if (error) {
          reject({ code: 500, msg: 'No se ha podido iniciar la transacción' });
          return;
        }
        // Insertando cabecera
        connection.query(
          'INSERT INTO ventas_cabecera SET ?',
          cabecera,
          async (error, result) => {
            if (error) {
              console.log(error);
              connection.rollback(() => {
                reject({ code: 400, msg: 'No se ha podido crear la factura' });
                return;
              });
            }

            if (result) {
              const { insertId } = result;
              cabecera.id_venta = insertId;
              let productos_comprados = [];
              const cantidad_productos = productos.length;
              // Insertando productos al detalle
              for (const producto of productos) {
                console.log(producto);
                const venta_detalle = {
                  id_venta_per: insertId,
                  id_producto_per: producto.id_producto,
                  cantidad_detalle: producto.cantidad,
                  subtotal_detalle: producto.cantidad * producto.precio_v_producto,
                  estado_detalle: 'activo',
                };

                connection.query(
                  'INSERT INTO venta_detalle SET ?',
                  venta_detalle,
                  (error, result) => {
                    if (error) {
                      connection.rollback(() => {
                        console.log(error);
                        reject({
                          code: 400,
                          msg: 'No se ha podido registrar un producto comprado',
                        });
                      });
                    }

                    if (result) {
                      const { insertId } = result;
                      productos_comprados.push({
                        id_detalle: insertId,
                        ...venta_detalle,
                      });
                      if (cantidad_productos === productos_comprados.length) {
                        connection.commit((error) => {
                          if (error) {
                            reject({
                              code: 400,
                              msg: 'No se ha podido registrar la venta',
                            });
                            return;
                          }

                          resolve({
                            venta: cabecera,
                            detalle: productos_comprados,
                          });
                        });
                      }
                    }
                  }
                );
              }
            }
          }
        );
      });
    });
  });
};

module.exports = { crearVenta };
