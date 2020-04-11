const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');







exports.proyectosHome = async (req, res) =>{
    const proyectos = await Proyectos.findAll();
    // render llama a pagina.pug
    res.render('index', {
        nombrePagina : 'Pagina principal', 
        proyectos
    });
}

exports.formularioProyecto = async (req, res) =>{
    const proyectos = await Proyectos.findAll();

    // render llama a pagina.pug
    res.render('nuevoProyecto', {
        nombrePagina : 'Nuevos Proyectos',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {

    const proyectos = await Proyectos.findAll();

    const nombre = req.body.nombre;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agregar un nombre al proyecto '})
    }

    if(errores.length >0){
        res.render('nuevoProyecto',{
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // no hay errores 
        // insertar en base de datos
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
        
    }
}



exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise = Proyectos.findAll();
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



// consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({

        where: {
            proyectoId : proyecto.id
        }
        // include: [
        //     {model: Proyectos}
        // ]
    });


    
   if(!proyecto) return next();
   
   res.render('tareas',{
        nombrePagina: 'Tareas proyecto',
        proyecto,
        proyectos,
        tareas

   })
} 



exports.formularioEditar= async (req,res) => {
    const proyectosPromise = Proyectos.findAll();
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })

}







exports.actualizarProyecto = async(req, res) => {
    const { nombre } = req.body; // Nombre que viene en el INPUT formulario
    const id = req.params.id; // Valor que ID que viene en URL
 
    const proyectos = await  Proyectos.findAll();
   
 
    let errores = [];
 
 
    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' });
    }
 
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            titulo: 'Actualizar proyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.update(
            { nombre: nombre }, 
            { where: { id: id }}
            );
        res.redirect('/');
    }
}





exports.eliminarProyecto = async (req, res,next) => {

    // req, contiene imformacion los lees con query
    //console.log(req.query);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});



    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente');
}