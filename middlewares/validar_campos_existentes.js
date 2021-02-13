const { response } = require('express');
const {
  existeClientePorCedula,
  existeClientePorCedulaActualizable,
} = require('../controllers/clientes.controller');
const {
  existePasilloPorNombre,
  existePasilloPorNombreActualizable,
} = require('../controllers/pasillos.controller');
const { existePerchaPorNombre } = require('../controllers/perchas.controller');

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

const validarPasilloExistente = async (req, res = response, next) => {
  const { nombre_pasillo } = req.body;

  await existePasilloPorNombre(nombre_pasillo)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'El pasillo ingresado ya se encuentra registrado',
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

const validarPasilloExistenteActualizable = async (req, res = response, next) => {
  const { nombre_pasillo } = req.body;
  const pasillo_id = req.params.id;
  await existePasilloPorNombreActualizable(pasillo_id, nombre_pasillo)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'El pasillo ingresado ya se encuentra registrado',
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

const validarPerchaExistente = async (req, res = response, next) => {
  const { nombre_percha } = req.body;

  await existePerchaPorNombre(nombre_percha)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'La percha ingresada ya se encuentra registrada',
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

const validarPerchaExistenteActualizable = async (req, res = response, next) => {
  const { nombre_percha } = req.body;
  const id_percha = req.params.id;
  await existePasilloPorNombreActualizable(id_percha, nombre_percha)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'La percha ingresada ya se encuentra registrada',
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

const validarProductoExistente = async (req, res = response, next) => {
  const { nombre_producto } = req.body;

  await existePerchaPorNombre(nombre_producto)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'El producto ingresado ya se encuentra registrado',
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

const validarProductoExistenteActualizable = async (req, res = response, next) => {
  const { nombre_producto } = req.body;
  const id_producto = req.params.id;
  await existePasilloPorNombreActualizable(id_producto, nombre_producto)
    .then((existe) => {
      if (existe) {
        return res.status(409).json({
          ok: false,
          msg: 'El producto ingresado ya se encuentra registrado',
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

module.exports = {
  validarClienteExistente,
  validarClienteExistenteActualizable,
  validarPasilloExistente,
  validarPasilloExistenteActualizable,
  validarPerchaExistente,
  validarPerchaExistenteActualizable,
  validarProductoExistente,
  validarProductoExistenteActualizable,
};
