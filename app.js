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
//rutas de pasillos
app.use('/api/pasillos', require('./routes/pasillos.route'));
//rutas de perchas
app.use('/api/perchas', require('./routes/perchas.route'));
//rutas de productos
app.use('/api/productos', require('./routes/productos.route'));
// rutas de roles
app.use('/api/roles', require('./routes/roles.route'));
// rutas de uploads
app.use('/api/uploads', require('./routes/uploads.route'));
// rutas de usuarios
app.use('/api/usuarios', require('./routes/usuarios.route'));

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.APP_PORT}`);
});
