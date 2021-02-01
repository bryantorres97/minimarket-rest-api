const { Router } = require('express');
const {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRolPorId,
  eliminarRolPorId,
} = require('../controllers/roles.controller');

const router = Router();

router.get('/', obtenerRoles);
router.get('/:id', obtenerRolPorId);
router.post('/', crearRol);
router.put('/:id', actualizarRolPorId);
router.delete('/:id', eliminarRolPorId);

module.exports = router;
