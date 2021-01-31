// Obteniendo variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

//CONFIGURACION DE CORS
app.use(cors());

//LECTURA Y ESCRITURA DEL BODY ---ANTES DE LAS RUTAS
app.use(express.json());

// SECTION - RUTAS

//rutas de clientes
app.use('/api/clientes', require('./routes/clientes.route'));

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.APP_PORT}`);
});
