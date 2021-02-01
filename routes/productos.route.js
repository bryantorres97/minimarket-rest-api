const { Router } = require('express');
const {
  obtenerProdcutos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProductoPorId,
  eliminarProductoPorId,
} = require('../controllers/productos.controller');

const router = Router();

router.get('/', obtenerProdcutos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProductoPorId);
router.delete('/:id', eliminarProductoPorId);

module.exports = router;
