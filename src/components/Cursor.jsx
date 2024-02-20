
import { useState, useEffect } from 'react'

import { generateRandomColor } from '../functions/Cursor-functions'

import './../styles/Cursor.css'

export function Cursor() {
    const [numFollowers, setNumFollowers] = new useState(1) //Este useState maneja el numero de elementos o punteros (Cursor-Followers) que sigen al raton
    const [statusTracking, setStatusTracking] = new useState(true) //Este elemento maneja si esta activo el seguimiento del raton o no
    const [cursorFollowers, setCursorFollowers] = new useState(  
        [<div 
            key='CF0'
            className="Cursor-Follower"
            id='CF0'
            style={{
                backgroundColor: generateRandomColor(), 
                zIndex: 10000
                }}
        />]
    ) /* Este elemento es un array de todos los punteros (Cursor-Followers) que siguen al raton, 
         lo inicializo con el primero, ya que como minimo debe tener uno ya siguiendole.*/


    useEffect(() => {
        //La idea de este useEffect es que solo se active cuando cambie el statusTracking, osea si se tiene que seguir al raton o no

        let moveElement = (event) => {
            /**
             * Esta funcion actua cuando el raton se mueve, lo que hace es cambiar la posicion 
             * (Cursor-Followers) de todos los puntero que lo sigen
             * 
             * 1. obtenemos la posicion X e Y del raton con el event
             * 2. Obtenemos en array todos los punteros que hay: 
             *      Array.from(document.getElementsByClassName('Cursor-Follower'))
             * 3. Creamos la variable time que controlara el retraso con el que se modifica el 
             *      translate para cada elemento
             * 4. Recorremos el array cursorFollower donde hacemos un setTimeout determinado por el time
             *      que llamara a la funcion serpentine que recibe el elemento a modificar y las coordenadas del raton
             * 
             * Des esta manera hacemos que todos los elementos sigan al raton, pero con un retraso, 
             * para que hagan una serpiente
             */
            const x = event.clientX
            const y = event.clientY

            const cursorFollower = Array.from(document.getElementsByClassName('Cursor-Follower'))

            let time = 0; //Controla el tiempo que tardara el setTimeout en ejecutarse

            cursorFollower.forEach((element) => {
                setTimeout(() => { serpentine(element, x, y); }, time);
                time += 30 //cada iteracion le subimos 30 milisegundos para hacer el efecto de serpiente
            })
        }

        let serpentine = (element, x, y) => {
            //cada elemento que se pasa se le actualiza su posicion con las coordenadas del raton pasadas
            element.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        }

        if (statusTracking) {
            //Creamos el evento que llama a la funcion encargada de mover los punteros (Cursor-Followers) cuando el raton se mueve
            window.addEventListener("mousemove", moveElement)
        }

        return () => { //Falta por comentar
            window.removeEventListener("mousemove", moveElement)
        }

    }, [statusTracking]);

    useEffect(() => {
        /**
         * Este useEfect se encarga de añadir o quizar del array de  cursorFollowers un puntero (Cursor-Follower)
         * 
         * La idea es que siempre se añada al final del array y se quite el ultimo añadido, es una pila
         */

        let newCursorFollowers = [...cursorFollowers] //hacemos una copia de array
        let longitud = newCursorFollowers.length //nos quedamos con su longitud para el key y el id del elemento

        if(numFollowers>longitud) { // si el numFollowers es mayor a la longitud del array es que hay que añadir un nuervo puntero (Cursor-Follower)
            newCursorFollowers.push(
                <div 
                    key={`CF${longitud}`}
                    className="Cursor-Follower"
                    id={`CF${longitud}`}
                    style={{
                        backgroundColor: generateRandomColor(),
                        zIndex: 9999-longitud,
                        transform: document.getElementsByClassName('Cursor-Follower')[0].style.transform
                        }}
                    
                />);
        } else if(numFollowers<longitud && numFollowers>=1) {
            /**
             * si el numFollowers es menora la longitud del array es que hay que quitar el ultimo puntero (Cursor-Follower) añadio,
             * pero si encima el numFollowers tiene que ser igual o mayor a 1 para poder hacerlo, asi siempre nos aseguramos que
             * como minimo hay un puntero (Cursor-Follower)
             */
            newCursorFollowers.pop()
        }
        
        //con la copia del array modificada modificamos el useState
        setCursorFollowers(newCursorFollowers)
    }, [numFollowers]);

    const onChangeNF = (event) => {
        //esta funcion se encarga de cambiar el numero de numFollowers por el del input, asi decidimos cuantos puntero (Cursor-Follower) queremos
        setNumFollowers(event.target.value)
    }

    return (
        <div className='Cursor-Module'>
            <div className='List-Cursor-Followers' data-status-tracking={statusTracking}>
                {cursorFollowers}
            </div>


            <div className='Base-Input-Number'>
                <label>Number of followers</label>
                <input type='number' onChange={onChangeNF} min={1} value={numFollowers}/>
            </div>

            <div className='Base-Button'>
                <button type='button' onClick={() => setStatusTracking(statusTracking ? false : true)} >
                    {statusTracking ? 'Untracking' : 'Tracking'}
                </button>
            </div>
        </div>
    )
}