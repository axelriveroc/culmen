const express = require('express'); 
const path = require('path');
const app = express(); 
// PUERTO A UTILIZAR 
const PORT = 3030; 
// RUTAS PATH 
const publicPath = path.join(__dirname ,'/public');

/************ REQUIRE DE RUTAS  **************/ 
const mainRoute =  require('./routes/mainRoute.js');  
const productsRoute = require('./routes/productsRoute');
const carritoRoute =  require('./routes/carritoRoute.js'); 
const usersRoute =  require('./routes/usersRoute'); 
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

/******* REQUIRE DE SESSION *******/
const cookieParser = require('cookie-parser');
const session = require('express-session'); 

/********** CAPTURAR INFO DE POST *************/
app.use(express.urlencoded( { extended:false } ));
app.use(express.json());

/********* CONFIGURANDO EL METODO OVERRIDE  ************/
const methodOverride = require('method-override'); 
app.use(methodOverride('_method')); 

/******** MIDDLEWARES DE APLICACION **********/
app.use(session({
    secret: 'secretito', 
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());

app.use(userLoggedMiddleware); 

/**********  ESCUCHANDO EL PUERTO   *********/
app.listen(PORT , ()=>{
    console.log('Servidor corriendo en el puerto ' + PORT)
});

/*********  SETEANDO LAS VISTAS PARA TRABAJAR CON EJS ***********/
app.set('view engine', 'ejs'); 
app.set("views", path.join(__dirname, "views"));

/********** CONFIGURANDO LA CARPETA PUBLIC  ***********/
app.use(express.static(publicPath)); 

/********** USE DE RUTAS PRINCIPALES *************/

app.use('/' , mainRoute );
app.use('/products' , productsRoute)
app.use('/carrito' , carritoRoute);
app.use('/user' , usersRoute);



// probando pruebas de seguridad