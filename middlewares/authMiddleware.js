// para ir al profile si esta logueado y evitar que vaya al login 

const authMiddleware = (req, res, next)=>{

    if ( !req.session.userLogged ) {
        res.redirect('/user/login')
    }
    next()
}

module.exports = authMiddleware; 