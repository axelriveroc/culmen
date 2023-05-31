// para que no vaya al profile, y re-dirigirlo al login/register

const guestMiddleware = ( req, res, next )=>{
    
    if ( req.session.userLogged ) {
        res.redirect('/user/profile')
    }

    next(); 

} 

module.exports = guestMiddleware; 