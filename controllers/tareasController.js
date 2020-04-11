const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req,res) => {
    // obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url}});

    //leer el valor del input
    const {tarea} = req.body;



    // estado 0 = incompleto y ID de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //instertar en la base de datos

    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    res.redirect(`/proyectos/${req.params.url}`);
}


exports.cambiarEstadoTarea = async (req,res ) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {id : id }});

    //cambiar el estado

    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if(!resultado) return next();
    res.status(200).send('actualizado');
}


exports.eliminarTarea = async (req,res) => {

      //  console.log(req.query);
    
      const {id} = req.params;

      // eliminar tarea

      const resultado= await Tareas.destroy({where : {id : id }});

      if(!resultado) return next();
      res.status(200).send('Tarea eliminada correctamente ');

}