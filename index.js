const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
// const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

// Crear el servidor
const app = express();

// Definir un dominio(s) para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    // Revisar si la peticion viene de un servidor que esta en whitelist
    const existe = whitelist.some((dominio) => dominio === origin);
    if (existe) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};

// Habilitar Cors
app.use(cors(corsOptions));

// Conectar a MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

// Habilitar body-parser
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// Habilitar body-parser propio de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar routing
app.use('/', routes()); // -> .use es un middleware

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

// Puerto y arrancar el servidor
app.listen(port, host, () => {
  console.log('Servidor inciado');
});
