const path = require('path');
const { body } = require('express-validator'); 

const validateRegister = [
    body('name')
    .notEmpty().withMessage('Campo requerido').bail()
    .isLength({ min: 3}).withMessage('Minimo 3 letras')
    ,
    body('lastName')
    .notEmpty().withMessage('Campo requerido').bail()
    .isLength({ min: 3}).withMessage('Minimo 3 letas')
    ,
    body('email')
    .notEmpty().withMessage('Campo requerido').bail()
    .isEmail().withMessage('Debe ser un formato válido de email')
    ,
    body('password')   
    .notEmpty().withMessage('Campo requerido').bail()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).withMessage('La contraseña debe incluir al menos una letra minúscula, una letra mayúscula y un número')
    ,
    body('passConfirm')
    .notEmpty().withMessage('Campo requerido').bail()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Las contraseñas no coinciden');
        }
        return true;
      })
    //.equals('password').withMessage('Las contraseñas no coinciden')
    ,
    body('userImage')
    .custom((value, { req }) => {

      let file = req.file;
		  let acceptedExtensions = ['.jpg', '.png', '.gif', '.jepg'];

      if (!file) {
        throw new Error('Tienes que subir una imagen');
      } else {
        let fileExtension = path.extname(file.originalname);
        if (!acceptedExtensions.includes(fileExtension)) {
          throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
        }
      }

		return true;
	})
    //.isMimeType(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']).withMessage('Sólo se admiten imágenes en formato JPEG, JPG, PNG Y GIF')
]

module.exports = validateRegister; 