const express = require('express');
const router = express.Router();

// importar express validator

const {body} = require('express-validator');

//importar controlador
const proyectosController = require ('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = function(){
    //ruta para el home
    router.get('/',
    authController.usuarioAuntenticado,
    proyectosController.proyectosHome);


    router.get('/nuevo-proyecto',
    authController.usuarioAuntenticado,
    proyectosController.formularioProyecto);



    router.post('/nuevo-proyecto',
    authController.usuarioAuntenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto);



    //listar proyecto
    router.get('/proyectos/:url',
    authController.usuarioAuntenticado,
    proyectosController.proyectoPorUrl);

    
    // ACtualizar proyecto
    router.get('/proyecto/editar/:id', 
    authController.usuarioAuntenticado,
    proyectosController.formularioEditar);


    router.post('/nuevo-proyecto/:id',
    authController.usuarioAuntenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto);

    //eliminar proyecto 
    router.delete('/proyectos/:url',
    authController.usuarioAuntenticado,
    proyectosController.eliminarProyecto);
    
    // tareas 
    router.post('/proyectos/:url',
    authController.usuarioAuntenticado,
    tareasController.agregarTarea);


    //actualizar tarea
    router.patch('/tareas/:id',
    authController.usuarioAuntenticado,
    tareasController.cambiarEstadoTarea);


    //eliminar tarea
    router.delete('/tareas/:id',
    authController.usuarioAuntenticado,
    tareasController.eliminarTarea);


    // crear nueva cuenta 

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);


    // INICIAR SESION 
    router.get('/iniciar-sesion',usuariosController.forminiciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);


    //restablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecePassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);


    return router;
}

