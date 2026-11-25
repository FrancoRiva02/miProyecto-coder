class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
}

async function cargarProductosDesdeJSON() {
  const respuesta = await fetch("./data/productos.json");

  if (!respuesta.ok) {
    throw new Error("Error al conectar con productos.json (Código " + respuesta.status + ")");
  }

  const datos = await respuesta.json();
  return datos.map(function(item) {
    return new Producto(item.id, item.nombre, item.precio, item.stock);
  });
}