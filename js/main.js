// ==========================================
// 1. CLASE Y MODELO DE DATOS
// ==========================================
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
}

// Productos por defecto si todavia no hay nada en el storage
const productosIniciales = [
  new Producto(1, "Remera", 15000, 10),
  new Producto(2, "Pantalon", 28000, 8),
  new Producto(3, "Zapatillas", 45000, 5),
  new Producto(4, "Buzo", 32000, 6)
];

// 2. PERSISTENCIA: Inicializacion con Storage y Operador Nullish Coalescing (??)
// Si hay datos en localStorage los parseamos, si no, usamos los iniciales
const productosGuardados = JSON.parse(localStorage.getItem("catalogoProductos"));
let productos = productosGuardados ?? productosIniciales;

// ==========================================
// 3. REFERENCIAS AL DOM
// ==========================================
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputBuscador = document.getElementById("buscador");
const mensajeFeedback = document.getElementById("mensaje-feedback");

// ==========================================
// 4. FUNCION DE GUARDADO EN STORAGE
// ==========================================
function guardarEnStorage() {
  localStorage.setItem("catalogoProductos", JSON.stringify(productos));
}

// ==========================================
// 5. FUNCION DE RENDERIZADO (Con Destructuring)
// ==========================================
function renderizarProductos(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  for (const prod of lista) {
    // Aplicamos DESTRUCTURING para extraer las propiedades del objeto
    const { id, nombre, precio, stock } = prod;

    const div = document.createElement("div");
    div.className = "tarjeta-producto";
    div.innerHTML = `
      <h3>${nombre}</h3>
      <p><strong>Precio:</strong> $${precio}</p>
      <p><strong>Stock disponible:</strong> ${stock}</p>
      <button class="btn-eliminar" data-id="${id}">Eliminar</button>
    `;
    contenedorProductos.appendChild(div);
  }

  asignarEventosEliminar();
}

// ==========================================
// 6. FEEDBACK VISUAL
// ==========================================
function mostrarFeedback(mensaje, tipo) {
  mensajeFeedback.textContent = mensaje;
  // Operador ternario para asignar clase segun el tipo de mensaje
  mensajeFeedback.className = tipo === "exito" ? "mensaje exito" : "mensaje error";

  setTimeout(function() {
    mensajeFeedback.textContent = "";
    mensajeFeedback.className = "mensaje";
  }, 3000);
}

// ==========================================
// 7. GESTION DE EVENTOS Y SINCRONIZACION
// ==========================================

// Evento Submit: Agregar producto
formularioProducto.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);

  if (nombre !== "" && !isNaN(precio) && !isNaN(stock)) {
    // Operador ternario para definir el proximo ID
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);

    // 1. Actualizamos array
    productos.push(nuevoProducto);

    // 2. Guardamos en localStorage
    guardarEnStorage();

    // 3. Re-renderizamos vista
    renderizarProductos(productos);

    formularioProducto.reset();
    mostrarFeedback("¡Producto '" + nombre + "' agregado con éxito!", "exito");
  } else {
    mostrarFeedback("Por favor, completa todos los campos correctamente.", "error");
  }
});

// Evento de Teclado: Buscador en vivo
inputBuscador.addEventListener("input", function() {
  const termino = inputBuscador.value.toLowerCase();
  
  const productosFiltrados = productos.filter(function(prod) {
    return prod.nombre.toLowerCase().includes(termino);
  });

  renderizarProductos(productosFiltrados);
});

// Evento Click: Eliminar producto
function asignarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  botonesEliminar.forEach(function(boton) {
    boton.addEventListener("click", function(e) {
      const idAEliminar = parseInt(e.target.getAttribute("data-id"));
      
      const indice = productos.findIndex(function(prod) {
        return prod.id === idAEliminar;
      });

      if (indice !== -1) {
        // Destructuring del producto eliminado para usar su nombre en el mensaje
        const { nombre } = productos[indice];

        // 1. Borramos del array
        productos.splice(indice, 1);

        // 2. Sincronizamos con el storage
        guardarEnStorage();

        // 3. Actualizamos pantalla
        renderizarProductos(productos);
        mostrarFeedback("Se eliminó '" + nombre + "'.", "error");
      }
    });
  });
}

// ==========================================
// 8. INICIALIZACION
// ==========================================
// Aseguramos persistencia inicial y renderizado al abrir o recargar
guardarEnStorage();
renderizarProductos(productos);