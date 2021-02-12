const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerPerchas,
  obtenerPerchaPorId,
  crearPercha,
  eliminarPerchaPorId,
  actualizarPerchaPorId,
} = require('../controllers/perchas.controller');
const { validarCampos } = require('../middlewares/validar_campos');
const {
  validarPerchaExistente,
  validarPerchaExistenteActualizable,
} = require('../middlewares/validar_campos_existentes');

const router = Router();

router.get('/', obtenerPerchas);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerPerchaPorId
);
router.post(
  '/',
  [
    check('nombre_percha', 'El nombre de la percha es requerido').notEmpty(),
    check('descripcion_percha', 'La descripción de la percha es requerida').notEmpty(),
    check(
      'id_pasillo_per',
      'El pasillo al que pertenece la percha es requerido'
    ).notEmpty(),
    check('id_pasillo_per', 'El id del pasillo no es válido').isNumeric(),
    validarCampos,
    validarPerchaExistente,
  ],
  crearPercha
);
router.put(
  '/:id',
  [
    check('id', 'El id de la percha no es válido').isNumeric(),
    check('nombre_percha', 'El nombre de la percha es requerido').notEmpty(),
    check('descripcion_percha', 'La descripción de la percha es requerida').notEmpty(),
    check(
      'id_pasillo_per',
      'El pasillo al que pertenece la percha es requerido'
    ).notEmpty(),
    check('id_pasillo_per', 'El id del pasillo no es válido').isNumeric(),
    validarCampos,
    validarPerchaExistenteActualizable,
  ],
  actualizarPerchaPorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  eliminarPerchaPorId
);

module.exports = router;
