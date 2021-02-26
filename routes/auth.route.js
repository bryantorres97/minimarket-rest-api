const { Router } = require('express');
const { login, renovarToken } = require('../controllers/auth.controller');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

router.get('/', validarJWT, renovarToken);

router.post('/', login);

module.exports = router;
