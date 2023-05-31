const path = require('path');
const { body } = require('express-validator'); 

const validateLogin = [

    body('emailLogin')
    .notEmpty().withMessage('Debes ingresar el mail con el cual te registraste').bail()
    .isEmail().withMessage('Debe ser un formato válido de email')
    ,
    body('passwordLogin')   
    .notEmpty().withMessage('Debes ingresar la contraseña con la cual te registraste').bail()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).withMessage('La contraseña debe incluir al menos una letra minúscula, una letra mayúscula y un número')
]

module.exports = validateLogin; 