import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Swal from 'sweetalert2'

const ModalInterno = ({id, isOpen, closeModal }) => {

    let [stock, setStock] = useState(0)
    let [nombre, setNombre] = useState(0)
    let [precio, setPrecio] = useState(0)
    let [marca, setMarca] = useState(0)
    let [fecha, setFecha] = useState(0)
    let [imgUrl, setImg] = useState(0)
    let [hardware, setHardware] = useState(0)
    let [perific, setPerific] = useState()

    const [modal, setModal] = useState(false);

    function handleChange(e) {
        setStock(e.target.value);
    }

  if (!isOpen) return null;

  async function borrar() {
    alert(id)
    const response = await fetch('http://localhost:3005/hardwareInterno/'+id, {
      method: 'DELETE',
    });
    
    Swal.fire({
        icon: "success",
        title: "Eliminado con exito"
    })
  }

  async function edit() {
    setModal(!modal)
    //alert(id)
  }

  const handleClick = () => {
    //Llamo a put
    alert("Chao mundo")
  }

  return (
    <>

    { modal && (
        <>
        <div className="M">
        <form>
            <label >Nombre del Componente o Periferico</label>
                <br/>
                <input type="text" onChange={(e) => setNombre(e.target.value)} required/>
                

            <div className="divRadios">
            
                Entrada
                <input id="radio" className="PerifericosEntrada" type="radio"  onChange={(e) => setPerific(e.target.className)} name="optionP" />
            </div>
            <div>
                Salida
                <input id="radio" className="PerifericosSalida" type="radio"  onChange={(e) => setPerific(e.target.className)} name="optionP"/>
            </div>
           

            <label >Precio del producto</label>
            <br/>
            <input type="text" onChange={(e) => setPrecio(e.target.value)} required/>
            <br />
                
       

        
            <label >Marca del producto</label>
            <br/>
            <input type="text" onChange={(e) => setMarca(e.target.value)} required/>
            <br />
           

           
            <label >Stock del producto</label>
            <br/>
            <input  type="range" value={stock} onChange={handleChange} required/>
            <p>{stock}</p>
          

          
            <label >Fecha de iniciado de venta</label>
            <br/>
            <input type="date" onChange={(e) => setFecha(e.target.value)} required/>
            <br />
            <label >Url del producto:</label>
            <br/>
                <input type="text" onChange={(e) => setImg(e.target.value)} required/>
            <br />
            <div className="divRadios">
                <div>
                    Externo
                    <input id="radio" className="externo" type="radio"  onChange={(e) => setHardware(e.target.className)} name="option" />
                </div>
                <div>
                    Interno
                    <input id="radio" className="interno" type="radio"  onChange={(e) => setHardware(e.target.className)} name="option"/>
                </div>
            </div>
            <button onClick={handleClick}>Registrar Producto</button>
        </form>
        </div>
        
        
        </>


    )}
    
    <div className="modal">

      <AiOutlineClose
        size={30}
        color="blue"
        onClick={closeModal}
      />
      <div className="containerr">
        <h3>Opciones:</h3>
        <button onClick={borrar}>Eliminar</button>
        <button onClick={edit}>Edit</button>
      
      </div>
    </div>

    </>
    
  );
};

export default ModalInterno;