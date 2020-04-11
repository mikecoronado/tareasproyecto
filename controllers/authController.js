const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op= Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');




exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos cambos son obligatorios'

});


// funcion para revisar si el usaurio esta logueado o no 

exports.usuarioAuntenticado = (req, res, next) => {

    // si el usuario esta autnenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //sino esta autneticado, redirigir a

    return res.redirect('/iniciar-sesion');
}





exports.cerrarSesion = (req, res) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}





//genera un token si el usuario es valido
exports.enviarToken = async (req,res) => {
    // verificar q usuario exista
    const {email} = req.body
    const usuario =  await Usuarios.findOne({where: {email}});

        // si no existe el usuario
        if(!usuario){
            req.flash('error', 'No existe esa cuenta');
            res.render('reestablecer',{
                nombrePagina: 'Restablecer',
                mensajes: req.flash()  
            });
        }


        //usuario existe
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now()+ 3600000;
        
        
        await usuario.save();

        //url de reset

        const resetUrl= `http://${req.headers.host}/reestablecer/${usuario.token}`;
        res.redirect(resetUrl);

        // enviar el correo con el token 

        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo : 'reestablecer-password'
        })

        //terminar 
        req.flash('correcto', 'Se envio un mensaje a tu correo');
        res.redirect('/iniciar-sesion');
}


exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });

    //si no encuentra el usuario
    if(!usuario){
        req.flash('error','No Valido');
        res.redirect('/reestablecer');
    }
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}


exports.actualizarPassword = async ( req,res) =>{
    // verificar el token valido pero tambien la fecha
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion:{
                [Op.gte]: Date.now()
            }
        }
    });

    //verificamos si el usuario existe
   if(!usuario){
       req.flash('error', 'No vlaido');
       res.redirect('/reestablecer');
   }

   //hashear nuevo password 
   usuario.password= bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
   usuario.token = null;
   usuario.expiracion= null;

   //guardamos el nuevo password

   await usuario.save();

   req.flash('correcto', 'tu password se ha modificado correctamente');
   res.redirect('/iniciar-sesion');
}