const { Router } = require('express');
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarClientePorId,
  eliminarClientePorId,
} = require('../controllers/clientes.controller');

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarClientePorId);
router.delete('/:id', eliminarClientePorId);

module.exports = router;
