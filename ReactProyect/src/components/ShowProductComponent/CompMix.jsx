import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useTheContext } from "../../Context/ContextProducts";
import out from "../../assets/out.svg";
import carrito from "../../assets/carrito.svg";
import compra from "../../assets/compra.svg";
import Swal from "sweetalert2";
import { useRef, useState } from "react";
import putPatch from "../../service/putPatch";
import { useNavigate } from "react-router-dom";

function ComplMix() {
  //let navigate = useNavigate();
  
  const { Mix, Users } = useTheContext();
  const [Modal, setModal] = useState(false);

  let ProductoEnCarrito = useRef();
  const [unidadesState, setUnidades] = useState();
  const unidadesRef = useRef([]);
  let sesion = localStorage.getItem("userValid");
  let contador = useRef(0);

  //Resetea el contador al salir del modal.
  if (Modal == false) {
    contador.current = 0;
    unidadesRef.current = 0;
  }
  const hhh = useRef();

  function buy(id) {
    if (sesion == undefined) {
      Swal.fire({
        icon: "info",
        text: "Tiene que registrarse para comprar productos.",
      });
    } else {
     
          for (const key in Mix) {
            if (Mix[key].id == id) {
              //Si no hay stock, no puede comprar el producto.
              if (Mix[key].stockTotal == 0) {
                Swal.fire({
                  icon: "error",
                  text: "Este producto esta agotado.",
                });
              } else {
                //Descuento calculo
                let PorcentajeDescuento = Mix[key].Descuento;

                for (let index = 100; index > PorcentajeDescuento; index--) {
                  if (PorcentajeDescuento < index) {
                    contador.current = contador.current + 1;
                  }
                }

                let DescuentoFinal = (contador.current / 100) * Mix[key].price;
                hhh.current = [
                  Mix[key].Descuento,
                  Mix[key].price,
                  DescuentoFinal,
                  Mix[key].img,
                  Mix[key].stockTotal,
                  Mix[key].id,
                  Mix[key].hardwareType
                ];
                setModal(!Modal);
              }
            }
          }
    }
  }
  
  const SeteoUnidades = (e) => {
    setUnidades(e.target.value);
    unidadesRef.current = [e.target.value];
  };

  const compraRealizada = () => {

    let unidadesSeleccionadas = unidadesRef.current[0];
    let precioProducto = hhh.current[1];

    let gastoTotal = unidadesSeleccionadas * precioProducto;
    let ChangeStock = hhh.current[4] - unidadesSeleccionadas;
    let TipoHardware = hhh.current[6]

    let StockDesaumento = {
      stockTotal: ChangeStock,
    };

    putPatch(hhh.current[5], StockDesaumento, TipoHardware);

    for (const key in Users) {
      if (Users[key].id == sesion) {

        let GastoGeneral = {
          comprasRecuento: gastoTotal + parseInt(Users[key].comprasRecuento),
          CantidadCompras:
            parseInt(unidadesSeleccionadas) +
            parseInt(Users[key].CantidadCompras),
        };
        putPatch(sesion, GastoGeneral, "users");
        //Forma de renderizar la pagina:
        // navigate("/home");

        // setTimeout(() => {
        //   navigate("/show1");
        // }, "1");
      }
    }

    setModal(!Modal);

    Swal.fire({
      title: "Comprado Exitosamente!",
      text: "Tu producto llegara a tu casa lo mas antes posible.",
      icon: "success",
    });

    //alert(gastoTotal)
  };


  function car(e) {
    if (sesion == undefined) {
      Swal.fire({
        icon: "info",
        text: "Tiene que registrarse para comprar productos.",
      });
    } else {
      Swal.fire({
        text: "¿Quieres agregar este producto al carrito?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.isConfirmed) {
          for (const j in Users) {
            if (Users[j].id == sesion) {
              if (Users[j].carrito != 0) {
                let carroPrevio = Users[j].carrito;

                for (const i in Mix) {
                  if (e.target.id == Mix[i].id) {
                    let ProductoEnCarrito = Mix[i];

                    carroPrevio.push(ProductoEnCarrito);

                    const Prdct = {
                      carrito: carroPrevio,
                    };

                    putPatch(sesion, Prdct, "users");
                    // //Forma de renderizar la pagina:
                    // navigate("/home");

                    // setTimeout(() => {
                    //   navigate("/show1");
                    // }, "1");
                  }
                }
              } else {
                for (const i in Mix) {
                  if (e.target.id == Mix[i].id) {
                    let Arreglo = [];
                    ProductoEnCarrito.current = Mix[i];
                    
                    Arreglo.push(ProductoEnCarrito.current);

                    const Prdct = {
                      carrito: Arreglo,
                    };

                    putPatch(sesion, Prdct, "users");
                    //Renderiza el carrito
                  }
                }
              }
            }
          }

          Swal.fire({
            title: "Agregado!",
            text: "Agregaste este producto al carrito.",
            icon: "success",
          });
        }
      });
    }
  }

  return (
    <>
      <div className="CompIntDiv">
        {Mix.map((product, i) => {
          return (
            <div id="categoria" className="filter" key={i}>
              <Card style={{ width: "15rem" }}>
                <Card.Img
                  className="imgProducClient"
                  variant="top"
                  src={product.img}
                />
                <Card.Body>
                  <Card.Title>{product.CoP}</Card.Title>
                  <Card.Text>
                    <strong>${product.price}</strong>
                  </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Categoria: {product.Category}</ListGroup.Item>
                  <ListGroup.Item>Marca: {product.brand}</ListGroup.Item>
                  <ListGroup.Item>Stock: {product.stockTotal}</ListGroup.Item>
                  <ListGroup.Item>
                    Fecha de venta: {product.date}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Descuento: {product.Descuento}%
                  </ListGroup.Item>
                </ListGroup>
                <Card.Body>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 300px",
                      gridTemplateRows: "40px 40px",
                    }}
                  >
                    <div>
                      <Card.Link onClick={() => buy(product.id, product.hardwareType)}>
                        <img src={compra} id={product.id} className="card" />
                      </Card.Link>
                    </div>
                    <div style={{ color: "blue" }}>Comprar Producto</div>
                    <div>
                      <Card.Link
                        onClick={(e) => {
                          car(e);
                        }}
                      >
                        <img src={carrito} id={product.id} className="card" />
                      </Card.Link>
                    </div>
                    <div style={{ color: "blue" }}>Agregar Carrito</div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          );
        })}

        {Mix == "" ? (
          <>
            <div style={{ width: " 500px", marginLeft: "450px" }}>
              <h2 style={{ margin: "auto", fontFamily: "arial" }}>
                No hay productos a la venta.
              </h2>
              <img src={out} alt="out" />
            </div>
          </>
        ) : (
          <p style={{ display: "none" }}>A la venta</p>
        )}
      </div>

      {Modal && (
        <div
          className="divModalProcesoCompra"
          style={{ borderRadius: "14px" }}
          open
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 350px",
              padding: "20px",
              border: "3px solid black",
              borderRadius: "10px",
            }}
          >
            <div>
              <img
                src={hhh.current[3]}
                style={{
                  width: "200px",
                  height: "200px",
                  borderColor: "red",
                  border: "5px solid black",
                  borderRadius: "10px",
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: "20px" }}>
                Precio Original: ${hhh.current[1]}
              </p>
              <p style={{ fontSize: "20px" }}>Descuento: {hhh.current[0]}%</p>
              <p style={{ fontSize: "20px" }}>
                Precio Final:{" "}
                <p style={{ color: "green" }}>${hhh.current[2]}</p>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", padding: "10px" }}>
            <div>
              <label>¿Cuantas unidades desea comprar?</label>
            </div>
            <div>
              <input
                onChange={(e) => SeteoUnidades(e)}
                type="range"
                max={hhh.current[4]}
                style={{ width: "200px" }}
              />
            </div>
            <div>
              <div>{unidadesState}</div>
            </div>
          </div>

          <button
             onClick={(compraRealizada)} //Aca solo se agarra el target del boton
            style={{
              backgroundColor: "#48e",
              color: "white",
              border: "none",
              fontSize: "25px",
              borderRadius: "10px",
            }}
          >

            Comprar
          </button>
        </div>
      )}
    </>
  );
}

export default ComplMix;
