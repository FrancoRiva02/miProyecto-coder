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

// Datos base de la tienda
const productosBase = [
  new Producto(1, "Remera", 15000, 10),
  new Producto(2, "Pantalon", 28000, 8),
  new Producto(3, "Zapatillas", 45000, 5),
  new Producto(4, "Buzo", 32000, 6)
];

// Variable global para almacenar los productos cargados
let productos = [];

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputBuscador = document.getElementById("buscador");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const bannerAviso = document.getElementById("banner-aviso");
const textoCargando = document.getElementById("texto-cargando");

// ==========================================
// 3. PERSISTENCIA EN STORAGE
// ==========================================
function guardarEnStorage() {
  localStorage.setItem("catalogoProductos", JSON.stringify(productos));
}

// ==========================================
// 4. FUNCION ASINCRONA: PROMESA CON SETTIMEOUT
// ==========================================
// Simula la consulta a una base de datos o servidor remoto
function pedirProductosServidor() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      // Simulamos que la conexion responde bien
      const conexionExitosa = true;

      if (conexionExitosa) {
        // Leemos del localStorage si ya habia algo, o devolvemos los datos base
        const datosStorage = JSON.parse(localStorage.getItem("catalogoProductos"));
        const resultado = datosStorage ?? productosBase;
        resolve(resultado);
      } else {
        reject("Error de conexión: No se pudo obtener el catálogo.");
      }
    }, 2000); // Demora simulada de 2 segundos
  });
}

// Consumo de la promesa con Async/Await y bloque Try-Catch-Finally
async function inicializarCatalogo() {
  try {
    textoCargando.textContent = "Cargando productos...";
    
    // Esperamos la resolucion de la promesa
    productos = await pedirProductosServidor();

    guardarEnStorage();
    renderizarProductos(productos);
    mostrarFeedback("Catálogo cargado con éxito (" + productos.length + " productos)", "exito");
  } catch (error) {
    // Si la promesa se rechaza se captura aca
    mostrarFeedback("No se pudo procesar la operación: " + error, "error");
    contenedorProductos.innerHTML = "<p>Hubo un inconveniente al cargar los datos.</p>";
  } finally {
    // El bloque finally se ejecuta siempre al terminar la carga
    textoCargando.style.display = "none";
  }
}

// ==========================================
// 5. TEMPORIZADOR INFORMATIVO (Aviso diferido)
// ==========================================
// Muestra una notificacion util unos segundos despues de entrar
setTimeout(function() {
  bannerAviso.textContent = "Cotización del día: Dólar Tarjeta $1.650 | 10% OFF pagando con Transferencia";
  bannerAviso.classList.remove("oculto");
}, 3000);

// ==========================================
// 6. RENDERIZADO EN PANTALLA
// ==========================================
function renderizarProductos(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay productos para mostrar.</p>";
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

function mostrarFeedback(mensaje, tipo) {
  mensajeFeedback.textContent = mensaje;
  mensajeFeedback.className = tipo === "exito" ? "mensaje exito" : "mensaje error";

  setTimeout(function() {
    mensajeFeedback.textContent = "";
    mensajeFeedback.className = "mensaje";
  }, 3500);
}

// ==========================================
// 7. EVENTOS DEL USUARIO
// ==========================================

// Agregar producto con manejo de errores try/catch
formularioProducto.addEventListener("submit", function(e) {
  e.preventDefault();

  try {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);

    if (nombre === "" || isNaN(precio) || isNaN(stock)) {
      throw new Error("Datos inválidos ingresados en el formulario.");
    }

    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);

    productos.push(nuevoProducto);
    guardarEnStorage();
    renderizarProductos(productos);

    formularioProducto.reset();
    mostrarFeedback("¡Producto '" + nombre + "' agregado con éxito!", "exito");
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
});

// Buscador en tiempo real
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
        mostrarFeedback("Se eliminó '" + nombre + "'.", "error");
      }
    });
  });
}

// ==========================================
// 8. INICIO DE LA APLICACION
// ==========================================
inicializarCatalogo();