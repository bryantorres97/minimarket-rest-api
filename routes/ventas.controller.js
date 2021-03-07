const { Router } = require('express');
const { crearVenta } = require('../controllers/ventas.controller');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

router.post('/', [validarJWT], crearVenta);

module.exports = router;
