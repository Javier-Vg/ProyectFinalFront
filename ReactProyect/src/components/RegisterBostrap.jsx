import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import postUser from '../service/postUser'
import { getUser } from '../service/getUser';
import Swal from 'sweetalert2'

function LoginBostrap() {

  //Estados de los inputs del register.
  let [NameUser,setNameUser]= useState()
  let [NombreReal,setNombreReal]= useState()
  let [correoContraRegister,setCorreoContraRegister]= useState()
  let [correoUsuario,setCorreoUsuario]= useState()
  let [Provincia,setProvincia]= useState()
  
  async function RecorrerUsuarios() { //Funcion que valida si el usuario ya existe o no
    let usuariosTotales = await getUser();
    let verific = 0;
      
    usuariosTotales.forEach(correos => {
        if (correos.correo == correoUsuario ) {
          verific = 1
        }
    })

    if (verific != 0) {
      return false
    }else{
      return true
    }
  }

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  }

  //  useEffect(() => {
  //    console.log(crudAutorizacion);
  //  },[crudAutorizacion])

    async function cargarRegister(e) {
      e.preventDefault()
      
      let infoP = {
        correo: correoUsuario,
        contra: correoContraRegister,
        usuario: NombreReal,
        provincia: Provincia,
        username: NameUser,
        comprasRecuento: 0,
        CantidadCompras: 0,
        carrito: 0
      }

      let corteDeFlujo = false;

      for (const clave in infoP) {
        if (infoP[clave] == undefined) {
          corteDeFlujo = true

          
          Swal.fire({
            icon: "error",
            title: "No puede enviar el formulario vacio..."
          })

          break;
        }
        //Regex para validar registro
        let key = infoP[clave]
        if (key == 0) { //Evasion de errores al captar valores del api
          continue;
        }else{
          key = key.replace(/^\s+|\s$/g, "");

          if (infoP[clave] == undefined || key == ""){
  
            Swal.fire({
              icon: "error",
              title: "Espacios incompletos"
            })
            return (false)
          }
        }
        
      }

      if (corteDeFlujo == false) {
        //Si retorna true, añade al usuario, si no, no, porque ese correo ya existe.
        if (await RecorrerUsuarios() == true) {

           Swal.fire({
             icon: "success",
            title: "¡Registrado Correctamente!"
           });
        
           postUser(infoP)
        }else{
         Swal.fire({
           icon: "error",
           title: "Ese usuario ya existe"
         });
        }
      }
    }

  return (
    
    <Form className='formRegister' noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Su nombre completo:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Ingrese su nombre:"
            value={NombreReal}
            onChange={(e)=>{setNombreReal(e.target.value)}}
            
          />
        </Form.Group>
      
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
              value={NameUser}
              onChange={(e)=>{setNameUser(e.target.value)}}
            />
            
          </InputGroup>
        </Form.Group>
      </Row>

      <Row className="mb-3">

        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Correo</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ingrese su correo:" 
            required
            value={correoUsuario}
            onChange={(e)=>{setCorreoUsuario(correoUsuario = e.target.value)}}
             />
          </Form.Group>

        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ingrese su contraseña:" 
            required 
            value={correoContraRegister}
            onChange={(e)=>{setCorreoContraRegister(e.target.value)}}
            />
          
        </Form.Group>

        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>Provincia</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Agregue su provincia" 
            required 
            value={Provincia}
            onChange={(e)=>{setProvincia(e.target.value)}}
            />

        </Form.Group>
      </Row>

        <Button onClick={cargarRegister} type="submit">Registrar Usuario</Button>
    </Form>
    
  );
}

export default LoginBostrap
