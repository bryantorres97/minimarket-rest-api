const { Router } = require('express');
const {
  obtenerPerchas,
  obtenerPerchaPorId,
  crearPercha,
  eliminarPerchaPorId,
  actualizarPerchaPorId,
} = require('../controllers/perchas.controller');

const router = Router();

router.get('/', obtenerPerchas);
router.get('/:id', obtenerPerchaPorId);
router.post('/', crearPercha);
router.put('/:id', actualizarPerchaPorId);
router.delete('/:id', eliminarPerchaPorId);

module.exports = router;
