const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerProdcutos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProductoPorId,
  eliminarProductoPorId,
} = require('../controllers/productos.controller');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();

router.get('/', obtenerProdcutos);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerProductoPorId
);
router.post(
  '/',
  [
    check('nombre_producto', 'El nombre es obligatorio').notEmpty(),
    check('descripcion_producto', 'La descripción es obligatoria').notEmpty(),
    check('precio_producto', 'El precio es obligatorio').notEmpty(),
    check('precio_producto', 'El precio debe ser un valor numérico').isNumeric(),
    check('precio_producto', 'El precio debe ser mayor que 0').isFloat({ min: 0.01 }),
    check('precio_v_producto', 'El precio de venta es obligatorio').notEmpty(),
    check(
      'precio_v_producto',
      'El precio de venta debe ser un valor numérico'
    ).isNumeric(),
    check('precio_v_producto', 'El precio de venta debe ser mayor que 0').isFloat({
      min: 0.01,
    }),
    check('stock_producto', 'El stock es obligatorio').notEmpty(),
    check('stock_producto', 'El stock debe ser un valor numérico').isNumeric(),
    check('stock_producto', 'El stock debe ser mayor que 0').isInt({ min: 1 }),
    check('codigo_producto', 'El código de producto es obligatorio').notEmpty(),
    check(
      'id_percha_per',
      'La percha a la que pertenece el producto es obligatoria'
    ).notEmpty(),
    check('id_percha_per', 'La percha asignada no es válida').isNumeric(),
    validarCampos,
  ],
  crearProducto
);
router.put(
  '/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('nombre_producto', 'El nombre es obligatorio').notEmpty(),
    check('descripcion_producto', 'La descripción es obligatoria').notEmpty(),
    check('precio_producto', 'El precio es obligatorio').notEmpty(),
    check('precio_producto', 'El precio debe ser un valor numérico').isNumeric(),
    check('precio_producto', 'El precio debe ser mayor que 0').isFloat({ min: 0.01 }),
    check('precio_v_producto', 'El precio de venta es obligatorio').notEmpty(),
    check(
      'precio_v_producto',
      'El precio de venta debe ser un valor numérico'
    ).isNumeric(),
    check('precio_v_producto', 'El precio de venta debe ser mayor que 0').isFloat({
      min: 0.01,
    }),
    check('stock_producto', 'El stock es obligatorio').notEmpty(),
    check('stock_producto', 'El stock debe ser un valor numérico').isNumeric(),
    check('stock_producto', 'El stock debe ser mayor que 0').isInt({ min: 1 }),
    check('codigo_producto', 'El código de producto es obligatorio').notEmpty(),
    check(
      'id_percha_per',
      'La percha a la que pertenece el producto es obligatoria'
    ).notEmpty(),
    check('id_percha_per', 'La percha asignada no es válida').isNumeric(),
    validarCampos,
  ],
  actualizarProductoPorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  eliminarProductoPorId
);

module.exports = router;
