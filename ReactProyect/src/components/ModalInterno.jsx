import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Swal from 'sweetalert2'
import putProducts from "../service/CrudProducts/putProducts";
import basura from "../assets/basura.svg";
import editar from "../assets/editar.svg";
import getProducts  from "../service/CrudProducts/getProducts";

const ModalInterno = ({id, isOpen, closeModal }) => {
    let [datos, setDatos] = useState([])

    let [stock, setStock] = useState(0)
    let [nombre, setNombre] = useState(0)
    let [precio, setPrecio] = useState(0)
    let [marca, setMarca] = useState(0)
    let [imgUrl, setImg] = useState(0)
  

    const [modal, setModal] = useState(false);


    function handleChange(e) {
        setStock(e.target.value);
    }

  if (!isOpen) return null;

  async function borrar() {

    //Borrar product:
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estas seguro de eliminar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        swalWithBootstrapButtons.fire({
          title: "Tu producto fue eliminado del sistema.",
          icon: "success"
        });
        
        fetch(`http://localhost:3005/hardwareInterno/${id}`, {
          method: 'DELETE',
        });

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Tu producto sigue en el sistema!",
          icon: "error"
        });
      }
    });
  }

  async function edit() {
    let respuesta = await getProducts(id, "hardwareInterno");
    //Añado la informacion del get en un hook, para luego utilizarla y darle valor a los inputs de edicion del producto
    setDatos([respuesta.CoP,respuesta.price, respuesta.brand, respuesta.stockTotal, respuesta.img])
    
    setModal(!modal)
  }

    const handleClick = () => {

      //Llamo a put
      //Crea el nuevo objeto con los valores modificados
        let ModificProduct = {
            CoP: nombre,
            price: precio,
            stockTotal: stock,
            brand: marca,
            img: imgUrl
        }
        
        putProducts(id, ModificProduct, "hardwareInterno")
        //Llama al metodo PUT:
    }
  return (
    <>
    { modal && (
        <dialog className="M-intE" open>
                <form>
                    <label >Nombre del Componente o Periferico</label>
                    <br/>
                    <input placeholder={datos[0]} type="text" onChange={(e) => setNombre(e.target.value)} required/>
                        
                    <br />
                    <label >Precio del producto</label>
                    <br/>
                    <input placeholder={datos[1]} type="text" onChange={(e) => setPrecio(e.target.value)} required/>
                    <br />
                        
                    <label >Marca del producto</label>
                    <br/>
                    <input placeholder={datos[2]} type="text" onChange={(e) => setMarca(e.target.value)} required/>
                    <br />
                
                    <label >Stock del producto</label>
                    <br/>
                    <input placeholder={datos[3]}  type="range" onChange={handleChange} required/>
                    <p>{stock}</p>   

                    <br />
                    <label >Url del producto:</label>
                    <br/>
                    <input placeholder={datos[4]} type="text" onChange={(e) => setImg(e.target.value)} required/>
                    <br />
                    <br />
                    
                    <button style={{marginLeft: "50px", borderRadius: "15px"}} onClick={handleClick}>Editar Producto</button>
                </form>

            </dialog>
    )}
    
    <div className="modal">

      <AiOutlineClose
        size={30}
        color="white"
        onClick={closeModal}
      />

      <div className="containerr">
        <button style={{background: "none", border: "none"}} onClick={borrar}><img src={basura} alt="trash" /></button>
        <button style={{background: "none", border: "none"}} onClick={edit}><img src={editar} alt="edit" /></button>
      </div>
    </div>

    </>
  );
};

export default ModalInterno;