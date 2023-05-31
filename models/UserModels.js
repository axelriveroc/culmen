const fs = require('fs'); 
const path = require('path'); 

const UserModels = {

    filename: './data/userData.json', 

    getData : function(){ 
        return JSON.parse( fs.readFileSync( this.filename , 'utf-8') )
    }, 
 
    generateId : function(){
        let allUsers = this.findAll(); 
        let lastUser = allUsers.pop();
        let newId = lastUser ? lastUser.id + 1 : 1 
        return newId
    },

    findAll : function(){return this.getData()}  , 

    findByPK : function (idTofind){
        let allUsers = this.findAll(); 
        let userFound = allUsers.find( ( { id } )=> id == idTofind )
        return userFound
    }, 

    findByField: function( field , text ){
        let allUsers = this.findAll(); 
        let userFound = allUsers.find( ( user ) => user[field] == text )
        return userFound
    }, 

    create: function( userData ){ //me llega el userdata // HACER UNA CREATEADMIN PARA CREAR USUARIOS CON LA CATEGORIA ADMIN , Y AGREGARLES A USERDATA EL CATEGORY: "ADMIN"
        const newUser = {
            id : this.generateId(),  
            ...userData
        }; 
        let allUsers = this.findAll(); 
        allUsers.push(newUser); 
        fs.writeFileSync( this.filename , JSON.stringify(allUsers , null, ' ')); 
        return newUser
    }, 

    delete: function( userId ){
        let allUsers = this.findAll(); 
        let newAllUsers =  allUsers.filter( ( { id } ) => id != userId);

        for (let i = 0; i < allUsers.length; i++) {
            if ( allUsers[i].id == userId ) {
                if (allUsers[i].imagen && allUsers[i].imagen !== 'imagenUsuario.png') {
                    fs.unlinkSync(path.join(__dirname , `../public/users/${allUsers[i].imagen}`))
                }
            }
        }

        fs.writeFileSync( this.filename , JSON.stringify( newAllUsers, null, ' ' ) ); 
        return true
    }, 

    edit: function(userId , newDataUser, newImage){ //me llegaria el req.body
        let allUsers = this.findAll(); 
        
        for (let i = 0; i < allUsers.length; i++) {
            if ( allUsers[i].id == userId ) {
                if (allUsers[i].imagen && allUsers[i].imagen !== 'imagenUsuario.png') {
                    fs.unlinkSync(path.join(__dirname , `../public/users/${allUsers[i].imagen}`))
                 } 
                allUsers[i] = {
                    id : allUsers[i].id,
                    ...newDataUser , 
                    imagen: newImage
                }
            }
        }

        fs.writeFileSync( this.filename , JSON.stringify(allUsers , null, ' ')); 

        return allUsers;
    }


}


module.exports = UserModels; 