const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarClientePorId,
  eliminarClientePorId,
} = require('../controllers/clientes.controller');
const { validarCampos, validarCedulaCliente } = require('../middlewares/validar_campos');
const {
  validarClienteExistente,
  validarClienteExistenteActualizable,
} = require('../middlewares/validar_campos_existentes');

const router = Router();

router.get('/', obtenerClientes);
router.get(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  obtenerClientePorId
);
router.post(
  '/',
  [
    check('nombre_cliente', 'El nombre del cliente es obligatorio').notEmpty(),
    check('apellido_cliente', 'El apellido del cliente es obligatorio').notEmpty(),
    check('cedula_cliente', 'La cédula del cliente es obligatoria').notEmpty(),
    validarCampos,
    validarCedulaCliente,
    validarClienteExistente,
  ],
  crearCliente
);
router.put(
  '/:id',
  [
    check('id', 'El id no es válido').isNumeric(),
    check('nombre_cliente', 'El nombre del cliente es obligatorio').notEmpty(),
    check('apellido_cliente', 'El apellido del cliente es obligatorio').notEmpty(),
    check('cedula_cliente', 'La cédula del cliente es obligatoria').notEmpty(),
    validarCampos,
    validarCedulaCliente,
    validarClienteExistenteActualizable,
  ],
  actualizarClientePorId
);
router.delete(
  '/:id',
  [check('id', 'El id no es válido').isNumeric(), validarCampos],
  eliminarClientePorId
);

module.exports = router;
