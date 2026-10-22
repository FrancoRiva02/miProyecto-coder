// Molde para los productos
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  aplicarDescuento(porcentaje) {
    let descuento = (this.precio * porcentaje) / 100;
    this.precio = this.precio - descuento;
  }

  vender(cantidad) {
    if (this.stock >= cantidad) {
      this.stock = this.stock - cantidad;
      return true;
    } else {
      return false;
    }
  }
}

// 1. Instancias de productos (minimo 4 objetos como pide la consigna)
const producto1 = new Producto(1, "Remera", 15000, 10);
const producto2 = new Producto(2, "Pantalon", 28000, 8);
const producto3 = new Producto(3, "Zapatillas", 45000, 5);
const producto4 = new Producto(4, "Buzo", 32000, 6);

// Array con el catalogo
const catalogo = [producto1, producto2, producto3, producto4];

console.log("Catalogo cargado:", catalogo);

// Funciones de calculo de la entrega anterior
const calcularSubtotal = (precio, cantidad) => precio * cantidad;

function calcularDescuentoOInteres(monto, metodo) {
  if (metodo === "1") {
    return monto * 0.90; // 10% descuento
  } else if (metodo === "2") {
    return monto;
  } else if (metodo === "3") {
    return monto * 1.15; // 15% recargo en 3 cuotas
  } else {
    return monto;
  }
}


// Metodos de orden superior aplicados al simulador

// Metodo de busqueda / filtrado: busca productos segun el presupuesto del usuario
function filtrarPorPrecio() {
  let presupuesto = parseFloat(prompt("Ingresa tu presupuesto maximo:"));

  if (!isNaN(presupuesto) && presupuesto > 0) {
    // Usamos .filter()
    let encontrados = catalogo.filter(function(prod) {
      return prod.precio <= presupuesto;
    });

    if (encontrados.length > 0) {
      // Usamos .map() para armar la lista de nombres
      let nombres = encontrados.map(function(prod) {
        return prod.nombre + " ($" + prod.precio + ")";
      });
      alert("Productos disponibles para tu presupuesto:\n" + nombres.join("\n"));
      console.log("Resultado del filtro:", encontrados);
    } else {
      alert("No encontramos productos por ese valor o menos.");
    }
  } else {
    alert("Numero no valido.");
  }
}

// Metodo de transformacion / calculo: suma total del valor del inventario
function calcularValorTotal() {
  // Usamos .reduce()
  let valorTotal = catalogo.reduce(function(acumulado, prod) {
    return acumulado + (prod.precio * prod.stock);
  }, 0);

  alert("El valor total de todo el stock de la tienda es: $" + valorTotal);
  console.log("Valor total del inventario: $" + valorTotal);
}

// Menu interactivo

alert("Bienvenido a la tienda");

let total = 0;
let cantidadTotal = 0;
let seguir = true;

while (seguir) {
  let opcion = prompt(
    "Selecciona una opcion:\n" +
    "1 - Comprar productos\n" +
    "2 - Filtrar por precio maximo (filter y map)\n" +
    "3 - Ver valor total del stock (reduce)\n" +
    "Escribi ESC para finalizar"
  );

  if (opcion === null || opcion.toUpperCase() === "ESC") {
    seguir = false;
  } else if (opcion === "1") {
    // Mostrar lista para elegir
    let menuProductos = "Elegi un producto por su numero:\n";
    for (const prod of catalogo) {
      menuProductos += prod.id + " - " + prod.nombre + " ($" + prod.precio + ") | Stock: " + prod.stock + "\n";
    }

    let elegido = prompt(menuProductos);
    // Usamos .find() para encontrar el producto
    let productoSeleccionado = catalogo.find(function(prod) {
      return prod.id == elegido;
    });

    if (productoSeleccionado) {
      let unidades = parseInt(prompt("¿Cuantas unidades queres de " + productoSeleccionado.nombre + "?"));

      if (!isNaN(unidades) && unidades > 0) {
        if (productoSeleccionado.vender(unidades)) {
          let subtotal = calcularSubtotal(productoSeleccionado.precio, unidades);
          total += subtotal;
          cantidadTotal += unidades;

          alert("Agregado al carrito. Subtotal: $" + subtotal);
          console.log("Subtotal agregado: $" + subtotal + " | Total acumulado: $" + total);
        } else {
          alert("No hay stock suficiente de " + productoSeleccionado.nombre + ". Quedan: " + productoSeleccionado.stock);
        }
      } else {
        alert("Ingresa un numero valido.");
      }
    } else {
      alert("Opcion invalida, intenta de nuevo.");
    }

  } else if (opcion === "2") {
    filtrarPorPrecio();
  } else if (opcion === "3") {
    calcularValorTotal();
  } else {
    alert("Opcion no valida.");
  }
}

// Finalizacion de compra
if (cantidadTotal > 0) {
  let medioPago = prompt(
    "Total: $" + total +
    "\nElegi medio de pago:\n1 - Efectivo/Transferencia (10% desc)\n2 - Tarjeta 1 pago\n3 - Tarjeta 3 cuotas (15% recargo)"
  );

  let final = calcularDescuentoOInteres(total, medioPago);

  if (medioPago === "3") {
    let cuotas = final / 3;
    alert("Total final: $" + final.toFixed(2) + " (3 cuotas de $" + cuotas.toFixed(2) + ")");
  } else {
    alert("Total final a pagar: $" + final.toFixed(2));
  }

  console.log("Compra finalizada. Total: $" + final);
} else {
  alert("No compraste ningun producto.");
}

console.log("Catalogo actualizado despues de las compras:", catalogo);