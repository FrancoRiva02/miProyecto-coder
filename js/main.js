
// 1. CLASE Y MODELO DE DATOS
class Producto {
 constructor(id, nombre, precio, stock) {
 this.id = id;
 this.nombre = nombre;
 this.precio = precio;
 this.stock = stock;
 }
}
// Array inicial de productos (mantenemos la tienda de ropa de las entregas anteriores)
const productos = [
 new Producto(1, "Remera", 15000, 10),
 new Producto(2, "Pantalon", 28000, 8),
 new Producto(3, "Zapatillas", 45000, 5),
 new Producto(4, "Buzo", 32000, 6)
];

// 2. REFERENCIAS AL DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputBuscador = document.getElementById("buscador");
const mensajeFeedback = document.getElementById("mensaje-feedback");

// 3. FUNCION DE RENDERIZADO
// Dibuja en el HTML la lista de productos que reciba
function renderizarProductos(lista) {
 // Limpiamos el contenedor para no duplicar elementos
 contenedorProductos.innerHTML = "";
 if (lista.length === 0) {
 contenedorProductos.innerHTML = "<p>No hay productos para mostrar.</p>";
 return;
 }
 // Recorremos el array y creamos el contenido con template literals
 for (const prod of lista) {
 const div = document.createElement("div");
 div.className = "tarjeta-producto";
 div.innerHTML = `
 <h3>${prod.nombre}</h3>
 <p><strong>Precio:</strong> $${prod.precio}</p>
 <p><strong>Stock disponible:</strong> ${prod.stock}</p>
 <button class="btn-eliminar" data-id="${prod.id}">Eliminar</button>
 `;
 contenedorProductos.appendChild(div);
 }
 // Asignamos el evento de eliminar a cada boton generado
 asignarEventosEliminar();
}

// 4. FEEDBACK VISUAL
function mostrarFeedback(mensaje, tipo) {
 mensajeFeedback.textContent = mensaje;
 mensajeFeedback.className = "mensaje " + tipo;
 // Se borra el mensaje a los 3 segundos
 setTimeout(function() {
 mensajeFeedback.textContent = "";
 mensajeFeedback.className = "mensaje";
 }, 3000);
}

// 5. GESTION DE EVENTOS
// Evento Submit: Agregar nuevo producto desde el formulario
formularioProducto.addEventListener("submit", function(e) {
 e.preventDefault(); // Evita recargar la pagina
 const nombre = inputNombre.value.trim();
 const precio = parseFloat(inputPrecio.value);
 const stock = parseInt(inputStock.value);
 if (nombre !== "" && !isNaN(precio) && !isNaN(stock)) {
 // Creamos nuevo ID correlativo
 const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
 const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);
 // Agregamos al array
 productos.push(nuevoProducto);
 // Actualizamos la vista en pantalla
 renderizarProductos(productos);
 // Limpiamos los inputs
 formularioProducto.reset();
 // Mostramos aviso al usuario
 mostrarFeedback("¡Producto '" + nombre + "' agregado con éxito!", "exito");
 } else {
 mostrarFeedback("Por favor, completa todos los campos correctamente.", "error");
 }
});
// Evento de Teclado (Input): Filtrar productos en vivo mientras se escribe
inputBuscador.addEventListener("input", function() {
 const termino = inputBuscador.value.toLowerCase();

 // Filtramos por coincidencia de nombre
 const productosFiltrados = productos.filter(function(prod) {
 return prod.nombre.toLowerCase().includes(termino);
 });
 renderizarProductos(productosFiltrados);
});
// Evento Click en botones "Eliminar"
function asignarEventosEliminar() {
 const botonesEliminar = document.querySelectorAll(".btn-eliminar");
 botonesEliminar.forEach(function(boton) {
 boton.addEventListener("click", function(e) {
 const idAEliminar = parseInt(e.target.getAttribute("data-id"));

 // Buscamos el indice del elemento en el array
 const indice = productos.findIndex(function(prod) {
 return prod.id === idAEliminar;
 });
 if (indice !== -1) {
 const nombreEliminado = productos[indice].nombre;
 productos.splice(indice, 1); // Borramos del array
 // Re-renderizamos para actualizar la vista
 renderizarProductos(productos);
 mostrarFeedback("Se eliminó '" + nombreEliminado + "'.", "error");
 }
 });
 });
}

// 6. INICIALIZACION
// Render inicial al cargar la pagina
renderizarProductos(productos);