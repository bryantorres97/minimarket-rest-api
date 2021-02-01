const { Router } = require('express');
const {
  obtenerPasillos,
  obtenerPasilloPorId,
  actualizarPasilloPorId,
  eliminarPasilloPorId,
  crearPasillo,
} = require('../controllers/pasillos.controller');

const router = Router();

router.get('/', obtenerPasillos);
router.get('/:id', obtenerPasilloPorId);
router.post('/', crearPasillo);
router.put('/:id', actualizarPasilloPorId);
router.delete('/:id', eliminarPasilloPorId);

module.exports = router;
