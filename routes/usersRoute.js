const express = require("express");
const router = express.Router();

/****** CONTROLLERS *******/
const userController = require('../controllers/usersController');

/***** MIDDLEWARES *****/
const uploadFileUser = require('../middlewares/usersMulterMiddleware'); 
const validationsRegister = require('../middlewares/validationRegisterUsers'); 
const validationLogin = require('../middlewares/validationLoginUser'); 
const guestMiddleware = require('../middlewares/guestMiddleware'); 
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/login", guestMiddleware ,userController.login);

/***** PROCESAR EL LOGIN DE INGRESO DE USUARIOS YA REGISTRADOS *****/
router.post('/login', validationLogin ,userController.processLogin);

/***** PROCESAR EL REGISTRO DE NUEVOS USUARIOS ****/
router.post('/' ,  uploadFileUser.single('userImage') , validationsRegister ,  userController.processRegister);

/********* ACCEDER AL PERFIL DEL USUARIO ***********/
router.get('/profile' ,  authMiddleware , userController.profile)

router.get('/logout' , userController.logout)

module.exports = router; 