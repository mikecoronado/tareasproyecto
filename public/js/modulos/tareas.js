import Axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';



const tareas = document.querySelector('.listado-pendientes');


if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            

            // request hacia /tareas/id; router

            const url = `${location.origin}/tareas/${idTarea}`;
            
           
            Axios.patch(url, {idTarea})
                .then(function(respuesta){
                   if(respuesta.status === 200){
                       icono.classList.toggle('completo');

                       actualizarAvance();
                   }
                })
        }
       
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas borrar este proyecto?',
                text: "un proyecto eliminado no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    //enviar el delete por axios

                    Axios.delete(url, {params: {idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status === 200){
                                console.log(respuesta);
                            
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //opcional una aleta
                                Swal.fire(
                                    'has eliminado esta tarea ',
                                    respuesta.data,
                                    'success'
                                )
                                actualizarAvance();
                            }
                            
                        });
                    
                }
            })
        }    
    
    });
}

export default tareas;