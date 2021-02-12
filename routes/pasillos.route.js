const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerPasillos,
  obtenerPasilloPorId,
  actualizarPasilloPorId,
  eliminarPasilloPorId,
  crearPasillo,
} = require('../controllers/pasillos.controller');
const { validarCampos } = require('../middlewares/validar_campos');
const {
  validarPasilloExistente,
  validarPasilloExistenteActualizable,
} = require('../middlewares/validar_campos_existentes');

const router = Router();

router.get('/', obtenerPasillos);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerPasilloPorId
);
router.post(
  '/',
  [
    check('nombre_pasillo', 'El nombre del pasillo es obligatorio').notEmpty(),
    check('descripcion_pasillo', 'La descripción del pasillo es obligatoria').notEmpty(),
    validarCampos,
    validarPasilloExistente,
  ],
  crearPasillo
);
router.put(
  '/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('nombre_pasillo', 'El nombre del pasillo es obligatorio').notEmpty(),
    check('descripcion_pasillo', 'La descripción del pasillo es obligatoria').notEmpty(),
    validarCampos,
    validarPasilloExistenteActualizable,
  ],
  actualizarPasilloPorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  eliminarPasilloPorId
);

module.exports = router;
