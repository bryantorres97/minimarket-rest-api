const { pool } = require('../database/config');
const fs = require('fs');

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = '';

  switch (tipo) {
    case 'productos':
      return await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) {
            reject({ code: 500, msg: 'No se ha podido establecer conexión' });
            return;
          }
          // SECTION Verificar existencia del producto
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

              if (!result) {
                reject({
                  code: 404,
                  msg: 'No existe el producto especificado',
                });

                connection.release((error) => {
                  if (error) console.log('No se pudo cerrar la conexión');
                });
              }

              if (result[0].foto_producto.trim().length > 0) {
                pathViejo = `./uploads/productos/${result[0].foto_producto}`;
                borrarImagen(pathViejo);
              }

              connection.query(
                ' UPDATE productos SET foto_producto = ? WHERE id_producto = ? AND estado_producto="activo"',
                [nombreArchivo, id],
                (error, result) => {
                  if (error) {
                    reject({
                      code: 502,
                      msg: 'No se puede ejecutar su petición en este momento',
                    });
                    return;
                  }

                  if (result.affectedRows > 0) {
                    resolve(true);
                  }

                  connection.release((error) => {
                    if (error) console.log('No se ha podido cerrar la conexión');
                  });
                }
              );
            }
          );
        });
      });
  }
};

module.exports = { actualizarImagen };
