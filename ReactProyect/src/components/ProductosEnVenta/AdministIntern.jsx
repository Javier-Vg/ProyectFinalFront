import Nabvar from "../navbar"
import {NavLink} from "react-router-dom";
import Elementos from "../elementos";
import Appp from "./CartaPractica";
import  useTheContext from "../../Context/ContextProducts"

function ProductsManejo() {
const {data, setState, state, setUpdate} = useTheContext()


  return (
    <>
      <Nabvar/>
      <div>AdministParts</div>
      {/* <Elementos hardware={"hardwareInterno"}/> */}
      {/*<Appp/> */}

      <Elementos hardware={"hardwareInterno"}/>
    
      
      <NavLink to="/crud">Volver</NavLink>
    </>
    
  )
}

export default ProductsManejo