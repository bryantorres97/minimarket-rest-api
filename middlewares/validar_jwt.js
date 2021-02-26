const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
  // Leer el token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No ha ingresado el token',
    });
  }

  try {
    const { id_usuario, cedula_usuario } = jwt.verify(token, process.env.JWT_SECRET);
    req.id_usuario = id_usuario;
    req.cedula_usuario = cedula_usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'El token ingresado no es valido',
    });
  }
};

module.exports = { validarJWT };
