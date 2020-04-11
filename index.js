
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser= require('cookie-parser'); 
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env'});


//helpers con funciones
const helpers = require('./helpers');


// Crear la conexion a la base de datos
const db = require('./config/db');


//IMportar modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


db.sync()
    .then(()=> console.log('Conectado al servidor '))
    .catch(error => console.log(error));


//crear una app de express
const app = express();


// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}));


//agregamos expprees validator a toda la app
app.use(expressValidator());

// DONDE CARGAR ARCHIVOS ESTATICOS
app.use(express.static('public'));




//HABILITAR PUG 
app.set('view engine','pug');


//agregar flash messages 
app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas  sin volvernos a autentificar

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//añadir la carpeta de las vistas 
app.set('views', path.join(__dirname, './views'));




//pasar var dump a la aplicacion 
app.use((req, res, next ) => {
        res.locals.vardump = helpers.vardump;
        res.locals.mensajes = req.flash();
        res.locals.usuario = {...req.user} || null;
        console.log(res.locals.usuario);
        next();
});





app.use('/', routes()  );

app.listen(3000);

// servidor y puerto

const host= process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;






