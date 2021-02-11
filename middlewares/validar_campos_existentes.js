const { response } = require('express');
const {
  existeClientePorCedula,
  existeClientePorCedulaActualizable,
} = require('../controllers/clientes.controller');

const validarClienteExistente = async (req, res = response, next) => {
  const { cedula_cliente } = req.body;

  await existeClientePorCedula(cedula_cliente)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'La cédula ingresada ya se encuentra registrada',
        });
      }
      next();
    })
    .catch((error) => {
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      });
    });
};

const validarClienteExistenteActualizable = async (req, res = response, next) => {
  const id_cliente = req.params.id;
  const { cedula_cliente } = req.body;

  await existeClientePorCedulaActualizable(id_cliente, cedula_cliente)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'La cédula ingresada ya se encuentra registrada',
        });
      }
      next();
    })
    .catch((error) => {
      res.status(error.code).json({
        ok: false,
        msg: error.msg,
      });
    });
};

module.exports = { validarClienteExistente, validarClienteExistenteActualizable };
