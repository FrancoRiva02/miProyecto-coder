let productos = [];
let carrito = JSON.parse(localStorage.getItem("carritoTienda")) || [];

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const textoCargando = document.getElementById("texto-cargando");
const inputBuscador = document.getElementById("buscador");
const selectorPago = document.getElementById("medio-pago");
const subtotalMonto = document.getElementById("subtotal-monto");
const totalMonto = document.getElementById("total-monto");
const btnVaciar = document.getElementById("btn-vaciar");
const btnFinalizar = document.getElementById("btn-finalizar");

function notificar(mensaje, color) {
  Toastify({
    text: mensaje,
    duration: 2500,
    gravity: "top",
    position: "right",
    style: {
      background: color === "verde" ? "#27ae60" : "#e74c3c"
    }
  }).showToast();
}

function guardarCarritoEnStorage() {
  localStorage.setItem("carritoTienda", JSON.stringify(carrito));
}

function renderizarCatalogo(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay prendas disponibles para ese criterio.</p>";
    return;
  }

  lista.forEach(function(item) {
    const { id, nombre, precio, stock } = item;
    const sinStock = stock <= 0;

    const div = document.createElement("div");
    div.className = "tarjeta-producto";
    div.innerHTML = `
      <h3>${nombre}</h3>
      <p><strong>Precio:</strong> $${precio}</p>
      <p><strong>Stock:</strong> ${sinStock ? "Sin stock" : stock}</p>
      <button class="btn-agregar" data-id="${id}" ${sinStock ? "disabled" : ""}>
        ${sinStock ? "Agotado" : "Agregar al Carrito"}
      </button>
    `;
    contenedorProductos.appendChild(div);
  });

  activarBotonesAgregar();
}

function activarBotonesAgregar() {
  const botones = document.querySelectorAll(".btn-agregar");
  botones.forEach(function(boton) {
    boton.addEventListener("click", function(e) {
      const idSeleccionado = parseInt(e.target.getAttribute("data-id"));
      agregarAlCarrito(idSeleccionado);
    });
  });
}

function agregarAlCarrito(id) {
  const productoElegido = productos.find(function(prod) {
    return prod.id === id;
  });

  if (!productoElegido || productoElegido.stock <= 0) {
    notificar("Producto agotado", "rojo");
    return;
  }

  const itemEnCarrito = carrito.find(function(item) {
    return item.id === id;
  });

  if (itemEnCarrito) {
    if (itemEnCarrito.cantidad < productoElegido.stock) {
      itemEnCarrito.cantidad++;
      notificar("Se sumó una unidad de " + productoElegido.nombre, "verde");
    } else {
      notificar("Alcanzaste el stock máximo disponible", "rojo");
      return;
    }
  } else {
    const { id, nombre, precio } = productoElegido;
    carrito.push({ id, nombre, precio, cantidad: 1 });
    notificar(nombre + " agregado al carrito", "verde");
  }

  guardarCarritoEnStorage();
  renderizarCarrito();
}

function renderizarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    subtotalMonto.textContent = "$0";
    totalMonto.textContent = "$0";
    return;
  }

  carrito.forEach(function(item) {
    const { id, nombre, precio, cantidad } = item;

    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <div class="info-item">
        <h4>${nombre}</h4>
        <p>$${precio} x ${cantidad} = $${precio * cantidad}</p>
      </div>
      <button class="btn-quitar" data-id="${id}">Quitar</button>
    `;
    contenedorCarrito.appendChild(div);
  });

  activarBotonesQuitar();
  actualizarTotales();
}

function activarBotonesQuitar() {
  const botonesQuitar = document.querySelectorAll(".btn-quitar");
  botonesQuitar.forEach(function(boton) {
    boton.addEventListener("click", function(e) {
      const idParaQuitar = parseInt(e.target.getAttribute("data-id"));
      quitarDelCarrito(idParaQuitar);
    });
  });
}

function quitarDelCarrito(id) {
  const indice = carrito.findIndex(function(item) {
    return item.id === id;
  });

  if (indice !== -1) {
    if (carrito[indice].cantidad > 1) {
      carrito[indice].cantidad--;
    } else {
      carrito.splice(indice, 1);
    }

    guardarCarritoEnStorage();
    renderizarCarrito();
    notificar("Producto actualizado en el carrito", "rojo");
  }
}

function actualizarTotales() {
  const subtotal = carrito.reduce(function(acumulado, item) {
    return acumulado + (item.precio * item.cantidad);
  }, 0);

  const metodo = selectorPago.value;
  let totalCalculado = subtotal;

  if (metodo === "efectivo") {
    totalCalculado = subtotal * 0.90;
  } else if (metodo === "cuotas") {
    totalCalculado = subtotal * 1.15;
  }

  subtotalMonto.textContent = "$" + subtotal.toFixed(2);
  totalMonto.textContent = "$" + totalCalculado.toFixed(2);
}

selectorPago.addEventListener("change", actualizarTotales);

inputBuscador.addEventListener("input", function() {
  const termino = inputBuscador.value.toLowerCase().trim();
  const filtrados = productos.filter(function(prod) {
    return prod.nombre.toLowerCase().includes(termino);
  });
  renderizarCatalogo(filtrados);
});

btnVaciar.addEventListener("click", function() {
  if (carrito.length === 0) {
    notificar("El carrito ya está vacío", "rojo");
    return;
  }

  Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se eliminarán todas las prendas seleccionadas",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then(function(resultado) {
    if (resultado.isConfirmed) {
      carrito = [];
      localStorage.removeItem("carritoTienda");
      renderizarCarrito();
      Swal.fire("Carrito vaciado", "Podés volver a seleccionar prendas del catálogo.", "success");
    }
  });
});

btnFinalizar.addEventListener("click", function() {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Por favor seleccioná al menos una prenda para continuar.", "info");
    return;
  }

  const montoFinal = totalMonto.textContent;

  Swal.fire({
    title: "¡Confirmar compra!",
    text: "El monto total a abonar es de " + montoFinal + ". ¿Deseás finalizar la orden?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#27ae60",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Confirmar pago",
    cancelButtonText: "Seguir mirando"
  }).then(function(resultado) {
    if (resultado.isConfirmed) {
      carrito.forEach(function(itemCarrito) {
        const prodCatalogo = productos.find(function(p) { return p.id === itemCarrito.id; });
        if (prodCatalogo) {
          prodCatalogo.stock -= itemCarrito.cantidad;
        }
      });

      carrito = [];
      localStorage.removeItem("carritoTienda");
      renderizarCarrito();
      renderizarCatalogo(productos);

      Swal.fire(
        "¡Muchas gracias por tu compra!",
        "La orden se procesó correctamente por " + montoFinal,
        "success"
      );
    }
  });
});

async function iniciarApp() {
  try {
    textoCargando.textContent = "Cargando catálogo...";
    productos = await cargarProductosDesdeJSON();
    renderizarCatalogo(productos);
    renderizarCarrito();
  } catch (err) {
    contenedorProductos.innerHTML = "<p>Ocurrió un error al cargar el catálogo de productos.</p>";
    notificar("No se pudo cargar la tienda: " + err.message, "rojo");
  } finally {
    textoCargando.style.display = "none";
  }
}

iniciarApp();