// Obteniendo variables de entorno
require('dotenv').config();

const express = require('express');
const { Router } = require('express');
const cors = require('cors');

const app = express();
const router = Router();
//CONFIGURACION DE CORS
app.use(cors());

//LECTURA Y ESCRITURA DEL BODY ---ANTES DE LAS RUTAS
app.use(express.json());

router.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Probando',
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.APP_PORT}`);
});
