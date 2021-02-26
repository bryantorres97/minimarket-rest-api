const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuarioPorId,
  eliminarUsuarioPorId,
  cambiarClave,
} = require('../controllers/usuarios.controller');
const {
  validarAdministrador,
  validarAdministradorActualizar,
} = require('../middlewares/validar_administrador');
const { validarCampos, validarCedulaUsuario } = require('../middlewares/validar_campos');
const {
  validarUsuarioExistente,
  validarUsuarioExistenteActualizable,
} = require('../middlewares/validar_campos_existentes');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

router.get('/', obtenerUsuarios);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerUsuarioPorId
);
router.post(
  '/',
  [
    check('nombre_usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('clave_usuario', 'La contraseña de usuario es obligatoria').notEmpty(),
    check('clave_usuario', 'La contraseña debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    check('cedula_usuario', 'La cédula es obligatoria').notEmpty(),
    check('id_rol_pertenece', 'El id del rol es obligatorio').notEmpty(),
    check('id_rol_pertenece', 'El id del rol no es válido').isNumeric(),
    validarCampos,
    validarCedulaUsuario,
    validarUsuarioExistente,
  ],
  crearUsuario
);
router.put(
  '/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('nombre_usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('clave_usuario', 'La contraseña de usuario es obligatoria').notEmpty(),
    check('clave_usuario', 'La contraseña debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    check('cedula_usuario', 'La cédula es obligatoria').notEmpty(),
    check('id_rol_pertenece', 'El id del rol es obligatorio').notEmpty(),
    check('id_rol_pertenece', 'El id del rol no es válido').isNumeric(),
    validarCampos,
    validarAdministradorActualizar,
    validarCedulaUsuario,
    validarUsuarioExistenteActualizable,
  ],
  actualizarUsuarioPorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos, validarAdministrador],
  eliminarUsuarioPorId
);

// /api/usuarios/password/:id
router.put(
  '/clave/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('clave_usuario', 'La contraseña de usuario es obligatoria').notEmpty(),
    check('clave_usuario', 'La contraseña debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
    validarJWT,
  ],
  cambiarClave
);

module.exports = router;
