// Clase para modelar productos
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
}

// Array principal de productos
let productos = [];

// Elementos del DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputBuscador = document.getElementById("buscador");
const textoCargando = document.getElementById("texto-cargando");

// Notificaciones visuales con la libreria Toastify
function notificar(mensaje, color) {
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: color === "verde" ? "#27ae60" : "#e74c3c"
    }
  }).showToast();
}

function guardarEnStorage() {
  localStorage.setItem("catalogoProductos", JSON.stringify(productos));
}

// Consumo de datos con FETCH y ASYNC/AWAIT
async function obtenerCatalogo() {
  try {
    textoCargando.textContent = "Cargando productos...";

    // 1. Revisamos si ya existen datos modificados en localStorage
    const datosGuardados = JSON.parse(localStorage.getItem("catalogoProductos"));

    if (datosGuardados && datosGuardados.length > 0) {
      productos = datosGuardados;
    } else {
      // 2. Si no hay datos, hacemos la peticion fetch al archivo local data.json
      const respuesta = await fetch("./data.json");

      if (!respuesta.ok) {
        throw new Error("No se pudo conectar con data.json (Status: " + respuesta.status + ")");
      }

      const datos = await respuesta.json();
      productos = datos;
      guardarEnStorage();
    }

    renderizarProductos(productos);
    notificar("Productos cargados con éxito", "verde");

  } catch (error) {
    notificar("Error al cargar los datos: " + error.message, "rojo");
    contenedorProductos.innerHTML = "<p>Hubo un problema al cargar el catálogo.</p>";
  } finally {
    // Apagamos el indicador de carga
    textoCargando.style.display = "none";
  }
}

// Renderizado de tarjetas con destructuring
function renderizarProductos(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  for (const prod of lista) {
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

// Agregar producto desde formulario
formularioProducto.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);

  if (nombre !== "" && !isNaN(precio) && !isNaN(stock)) {
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);

    productos.push(nuevoProducto);
    guardarEnStorage();
    renderizarProductos(productos);

    formularioProducto.reset();
    notificar("Producto '" + nombre + "' agregado", "verde");
  } else {
    notificar("Por favor completa todos los campos correctamente", "rojo");
  }
});

// Filtro en tiempo real por teclado
inputBuscador.addEventListener("input", function() {
  const termino = inputBuscador.value.toLowerCase();
  const filtrados = productos.filter(function(prod) {
    return prod.nombre.toLowerCase().includes(termino);
  });
  renderizarProductos(filtrados);
});

// Eliminar producto
function asignarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  botonesEliminar.forEach(function(boton) {
    boton.addEventListener("click", function(e) {
      const idAEliminar = parseInt(e.target.getAttribute("data-id"));
      const indice = productos.findIndex(function(p) {
        return p.id === idAEliminar;
      });

      if (indice !== -1) {
        const { nombre } = productos[indice];
        productos.splice(indice, 1);
        guardarEnStorage();
        renderizarProductos(productos);
        notificar("Se eliminó '" + nombre + "'", "rojo");
      }
    });
  });
}

// Inicio
obtenerCatalogo();