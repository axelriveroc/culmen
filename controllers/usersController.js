const bcryptjs = require('bcryptjs'); 
const { validationResult } = require('express-validator'); 
const User = require('../models/UserModels'); 

const userController = {
    
    login: (req, res) => {
        res.render('users/login')
    }, 

    // PROCESO DE REGISTER DE NUEVOS USUARIOS AL SISTEMA     // FALTA AGREGAR PARA LOS PERFILES ADMIN
    processRegister: (req, res)=>{

        const resultValidation = validationResult(req); 

        if ( !resultValidation.isEmpty() ) {  // primero verificamos si hay errores
            return res.render('users/login' , {
                errors: resultValidation.mapped() , 
                old: req.body
            });
        }

       // No Hay errores...
        let userInDB = User.findByField('email' , req.body.email);
        
        if ( userInDB ) {    // preguntamos si existe el usuario en la base de datos , si existe es porque ya esta registado
            return res.render('users/login', {
                errors: {
                    email:{
                        msg: 'Este email ya está registrado'
                    }
                }, 
                old: req.body
            });
        }
            // si no esta registrado, preparamos la info para enviar: 
        let userToCreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password , 10), 
            passConfirm: bcryptjs.hashSync(req.body.passConfirm , 10), // o hacer un delete de passConfirm
            imagen: req.file ? req.file.filename : 'imagenUsuario.png'
        };

        let userCreated = User.create(userToCreate);

        return res.send(userCreated)
        //res.redirect('user/profile/' + user.id ) 
    },

    processLogin: (req, res)=>{
        const resultValidation = validationResult(req); 

        if ( !resultValidation.isEmpty() ) {  // primero verificamos si hay errores
            return res.render('users/login' , {
                errors: resultValidation.mapped() , 
                old: req.body
            });
        }
        //si no hay errores 
        //verificar si el mail y la contraseña se corresponde con un usuario ya registrado(en la DB)
        let userInDB = User.findByField('email' , req.body.emailLogin);

        if( !userInDB ){
            return res.render('users/login' , {
                    errors: {
                        emailLogin: {
                            msg: 'Este mail no se encuentra registrado'
                        }
                } , 
                old: req.body
            });
        }
        
        let isOkPassword = bcryptjs.compareSync(req.body.passwordLogin , userInDB.password); 

        if ( isOkPassword ) { //si la contraseña ingresada coincide con la contraseña hasheada registrada del usuario
            delete userInDB.password;
            delete userInDB.passConfirm;
            req.session.userLogged = userInDB;

            if ( req.body.recordarme ) {
                res.cookie('userEmail' , req.body.emailLogin , { maxAge: (1000*60)*60 } )
            }

            res.redirect('/user/profile')
        }else{
            return res.render('users/login' , {
                errors: {
                    emailLogin: {
                        msg: 'Credenciales inválidas'
                    }
                }
            });
        }
    },

    profile: ( req, res )=>{
        let user = req.session.userLogged
        res.render('users/profile' , { user })
    }, 

    logout: (req, res)=>{
        res.clearCookie('userEmail'); 
        req.session.destroy(); 
        return res.redirect('/user/login'); 
    }


}


module.exports = userController; 