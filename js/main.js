//Te pido una disculpa, entre los tiempos de la semana y el cansancio pasé por alto la parte de continuar con el mismo proyecto. Mala mía, ya lo acomodé para que quede todo conectado.



// Clase para modelar los productos de la tienda
class Producto {
constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
}

  // Metodo para aplicar un descuento directo
aplicarDescuento(porcentaje) {
    let descuento = (this.precio * porcentaje) / 100;
    this.precio = this.precio - descuento;
}

  // Metodo para restar stock si alcanza la cantidad
vender(cantidad) {
    if (this.stock >= cantidad) {
    this.stock = this.stock - cantidad;
    return true;
    } else {
    return false;
    }
    }
}

// Instancias de productos para el catalogo (reemplazando las constantes fijas de la entrega 3)
const producto1 = new Producto(1, "Remera", 15000, 10);
const producto2 = new Producto(2, "Pantalon", 28000, 8);
const producto3 = new Producto(3, "Zapatillas", 45000, 5);

// Guardamos los productos en un array
const catalogo = [producto1, producto2, producto3];

console.log("Catalogo disponible:", catalogo);

// Funciones auxiliares de la entrega 3
const calcularSubtotal = (precio, cantidad) => precio * cantidad;

function calcularDescuentoOInteres(monto, metodo) {
if (metodo === "1") {
    return monto * 0.90; // 10% descuento
} else if (metodo === "2") {
    return monto;        // precio normal
} else if (metodo === "3") {
    return monto * 1.15; // 15% recargo en 3 cuotas
} else {
    return monto;
}
}

// Inicio del simulador
alert("Bienvenido a la tienda");

let total = 0;
let cantidadTotal = 0;
let seguir = true;

while (seguir) {
  // Mostramos el menu recorriendo el catalogo de productos
let textoMenu = "Elegi un producto:\n";
for (const prod of catalogo) {
    textoMenu += prod.id + " - " + prod.nombre + " ($" + prod.precio + ") | Stock: " + prod.stock + "\n";
}
textoMenu += "Escribi ESC para salir";

let productoElegido = prompt(textoMenu);

if (productoElegido === null || productoElegido.toUpperCase() === "ESC") {
    seguir = false;
} else {
    // Buscamos el producto segun el id que ingreso el usuario
    let encontrado = null;
    for (const prod of catalogo) {
    if (prod.id == productoElegido) {
        encontrado = prod;
        break;
        }
    }

    if (encontrado !== null) {
    let unidades = parseInt(prompt("¿Cuantas unidades queres?"));

    if (!isNaN(unidades) && unidades > 0) {
        // Ejecutamos el metodo de la clase para validar y restar stock
        if (encontrado.vender(unidades)) {
        let subtotal = calcularSubtotal(encontrado.precio, unidades);
        total += subtotal;
        cantidadTotal += unidades;

        alert("Agregado al carrito. Subtotal: $" + subtotal);
        console.log("Subtotal agregado: $" + subtotal + " | Total acumulado: $" + total);
        } else {
        alert("No hay stock suficiente de " + encontrado.nombre + ". Quedan: " + encontrado.stock);
        }
    } else {
        alert("Ingresa un numero valido.");
    }
    } else {
    alert("Opcion invalida, intenta de nuevo.");
    }
    }
}

// Pago final
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
    alert("No seleccionaste ningun producto.");
}

console.log("Estado final del catalogo:", catalogo);