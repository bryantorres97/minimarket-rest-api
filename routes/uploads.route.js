/*

    ruta: api/uploads/
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { fileUpload, retornaImagen } = require('../controllers/uploads.controller');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', fileUpload);

router.get('/:tipo/:foto', retornaImagen);

module.exports = router;
