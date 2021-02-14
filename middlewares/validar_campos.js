const { response } = require('express');
const { validationResult } = require('express-validator');
const { verificarCedula } = require('../helpers/verificar_cedula');

const validarCampos = (req, res = response, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(),
    });
  }

  next();
};

const validarCedulaCliente = (req, res = response, next) => {
  const { cedula_cliente } = req.body;
  const cedula_valida = verificarCedula(cedula_cliente);
  if (!cedula_valida) {
    return res.status(400).json({
      ok: false,
      msg: 'La cédula ingresada no es válida',
    });
  }

  next();
};

const validarCedulaUsuario = (req, res = response, next) => {
  const { cedula_usuario } = req.body;
  const cedula_valida = verificarCedula(cedula_usuario);
  if (!cedula_valida) {
    return res.status(400).json({
      ok: false,
      msg: 'La cédula ingresada no es válida',
    });
  }

  next();
};

module.exports = { validarCampos, validarCedulaCliente, validarCedulaUsuario };
