const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRolPorId,
  eliminarRolPorId,
} = require('../controllers/roles.controller');
const { validarCampos } = require('../middlewares/validar_campos');
const {
  validarRolExistente,
  validarRolExistenteActualizable,
} = require('../middlewares/validar_campos_existentes');

const router = Router();

router.get('/', obtenerRoles);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerRolPorId
);
router.post(
  '/',
  [
    check('nombre_rol', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
    validarRolExistente,
  ],
  crearRol
);
router.put(
  '/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('nombre_rol', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
    validarRolExistenteActualizable,
  ],
  actualizarRolPorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  eliminarRolPorId
);

module.exports = router;
