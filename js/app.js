const productos = [
{
id: 1,
nombre: "Pastel Red Velvet",
categoria: "Pasteles",
descripcion: "Bizcocho suave con crema de queso.",
precio: 85,
imagen: "https://images.unsplash.com/photo-1586788224331-947f68671cf7?auto=format&fit=crop&w=800&q=85"
},
{
id: 2,
nombre: "Torta de Chocolate",
categoria: "Pasteles",
descripcion: "Torta húmeda de chocolate con cobertura cremosa.",
precio: 75,
imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85"
},
{
id: 3,
nombre: "Cheesecake de Fresa",
categoria: "Tortas",
descripcion: "Cheesecake cremoso con salsa de fresas naturales.",
precio: 65,
imagen: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=85"
},
{
id: 4,
nombre: "Torta Helada",
categoria: "Tortas",
descripcion: "Clásica torta helada con textura suave y deliciosa.",
precio: 60,
imagen: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=85"
},
{
id: 5,
nombre: "Gelatina de Fresa",
categoria: "Postres",
descripcion: "Deliciosa gelatina de fresa preparada artesanalmente.",
precio: 1,
imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85"
},
{
id: 6,
nombre: "Chocotejas",
categoria: "Dulces",
descripcion: "Chocotejas artesanales rellenas y bañadas en chocolate.",
precio: 1,
imagen: "https://images.unsplash.com/photo-1548907040-4d42fcaa4d8b?auto=format&fit=crop&w=800&q=85"
},
{
id: 7,
nombre: "Cupcake de Vainilla",
categoria: "Cupcakes",
descripcion: "Suave cupcake de vainilla con frosting artesanal.",
precio: 5,
imagen: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=85"
},
{
id: 8,
nombre: "Cupcake de Chocolate",
categoria: "Cupcakes",
descripcion: "Cupcake de chocolate con cremosa cobertura.",
precio: 6,
imagen: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=85"
}
];

const WHATSAPP_NUMERO = "51999999999";

let carrito = JSON.parse(
localStorage.getItem("carritoDulceEncanto")
) || [];

let categoriaActual = "Todos";
let busquedaActual = "";

/* ==========================================
INICIALIZACIÓN
========================================== */

$(document).ready(function () {
inicializar();
});

function inicializar() {

$("#anio").text(new Date().getFullYear());

renderizarProductos();
renderizarCarrito();
actualizarContador();

/* Búsqueda */
$("#buscarProducto").on("input", function () {
    busquedaActual = $(this).val().toLowerCase().trim();
    renderizarProductos();
});

/* Comprar por WhatsApp */
$("#btnPagar").on("click", enviarPedidoWhatsApp);

/* Vaciar carrito */
$("#btnVaciar").on("click", function () {

    if (!carrito.length) {
        return;
    }

    if (!confirm("¿Seguro que deseas vaciar el carrito?")) {
        return;
    }

    carrito = [];

    guardarCarrito();
    renderizarCarrito();
    actualizarContador();
});

/* WhatsApp */
$("#whatsappFlotante, #linkWhatsapp").on("click", function (e) {
    e.preventDefault();
    abrirWhatsApp();
});

/* Agregar producto */
$(document).on("click", ".btn-agregar", function () {

    const id = Number($(this).data("id"));

    agregarAlCarrito(id);
});

/* Aumentar / disminuir cantidad */
$(document).on("click", ".cantidad-btn", function () {

    const id = Number($(this).data("id"));
    const accion = $(this).data("accion");

    modificarCantidad(id, accion);
});

/* Eliminar producto */
$(document).on("click", ".eliminar-item", function () {

    const id = Number($(this).data("id"));

    eliminarDelCarrito(id);
});

/* Filtros */
$(document).on("click", ".filter-btn", function () {

    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    categoriaActual = $(this).data("filter");

    renderizarProductos();
});

/* Categorías superiores */
$(document).on("click", ".category-card", function () {

    const categoria = $(this).data("categoria");

    categoriaActual = categoria;

    $(".filter-btn").removeClass("active");

    $('.filter-btn[data-filter="' + categoria + '"]')
        .addClass("active");

    renderizarProductos();

    document
        .querySelector("#productos")
        .scrollIntoView({
            behavior: "smooth"
        });
});


}

/* ==========================================
PRODUCTOS
========================================== */

function renderizarProductos() {

const contenedor = $("#listaProductos");

let productosFiltrados = productos.filter(producto => {

    const coincideCategoria =
        categoriaActual === "Todos" ||
        producto.categoria === categoriaActual;

    const textoBusqueda =
        `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
            .toLowerCase();

    const coincideBusqueda =
        !busquedaActual ||
        textoBusqueda.includes(busquedaActual);

    return coincideCategoria && coincideBusqueda;
});


if (!productosFiltrados.length) {

    contenedor.html(`
        <div class="col-12">
            <div class="text-center py-5">

                <div class="empty-cart-icon">
                    <i class="bi bi-search"></i>
                </div>

                <h4>No encontramos productos</h4>

                <p class="text-muted">
                    Intenta con otra búsqueda o categoría.
                </p>

                <button
                    class="btn btn-primary-custom"
                    id="btnMostrarTodos">
                    Ver todos
                </button>

            </div>
        </div>
    `);

    return;
}


let html = "";

productosFiltrados.forEach(producto => {

    const cantidadEnCarrito =
        obtenerCantidadProducto(producto.id);

    html += `
        <div class="col-sm-6 col-lg-4 col-xl-3">

            <div class="product-card">

                <div class="product-image-wrapper">

                    <img
                        src="${producto.imagen}"
                        alt="${escapeHTML(producto.nombre)}"
                        class="product-image"
                        loading="lazy"
                    >

                    <span class="product-category">
                        ${escapeHTML(producto.categoria)}
                    </span>

                </div>

                <div class="product-info">

                    <h3 class="product-title">
                        ${escapeHTML(producto.nombre)}
                    </h3>

                    <p class="product-description">
                        ${escapeHTML(producto.descripcion)}
                    </p>

                    <div class="product-footer">

                        <div class="product-price">
                            S/ ${formatearPrecio(producto.precio)}
                        </div>

                        <button
                            class="btn btn-add btn-agregar"
                            data-id="${producto.id}">

                            <i class="bi bi-cart-plus"></i>

                            ${cantidadEnCarrito > 0
                                ? `Agregar (${cantidadEnCarrito})`
                                : "Agregar"}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;
});


contenedor.html(html);


/* Botón mostrar todos */
$("#btnMostrarTodos").on("click", function () {

    categoriaActual = "Todos";
    busquedaActual = "";

    $(".filter-btn").removeClass("active");
    $('.filter-btn[data-filter="Todos"]')
        .addClass("active");

    $("#buscarProducto").val("");

    renderizarProductos();
});


}

/* ==========================================
CARRITO
========================================== */

function agregarAlCarrito(id) {

const producto = productos.find(
    producto => producto.id === id
);

if (!producto) {
    return;
}


const productoCarrito = carrito.find(
    item => item.id === id
);


if (productoCarrito) {

    productoCarrito.cantidad += 1;

} else {

    carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
    });
}


guardarCarrito();

renderizarCarrito();
actualizarContador();

mostrarNotificacion(
    `${producto.nombre} agregado al carrito`
);


}

function modificarCantidad(id, accion) {

const item = carrito.find(
    producto => producto.id === id
);

if (!item) {
    return;
}


if (accion === "sumar" || accion === "plus") {

    item.cantidad += 1;

} else if (
    accion === "restar" ||
    accion === "minus"
) {

    item.cantidad -= 1;
}


if (item.cantidad <= 0) {

    carrito = carrito.filter(
        producto => producto.id !== id
    );
}


guardarCarrito();

renderizarCarrito();
actualizarContador();
renderizarProductos();


}

function eliminarDelCarrito(id) {

const item = carrito.find(
    producto => producto.id === id
);

if (!item) {
    return;
}


carrito = carrito.filter(
    producto => producto.id !== id
);


guardarCarrito();

renderizarCarrito();
actualizarContador();
renderizarProductos();

mostrarNotificacion(
    `${item.nombre} eliminado del carrito`
);


}

function renderizarCarrito() {

const carritoVacio = $("#carritoVacio");
const carritoContenido = $("#carritoContenido");
const itemsCarrito = $("#itemsCarrito");


if (!carrito.length) {

    carritoVacio.removeClass("d-none");
    carritoContenido.addClass("d-none");

    itemsCarrito.html("");

    $("#cantidadTotal").text("0");
    $("#totalCarrito").text("S/ 0.00");

    return;
}


carritoVacio.addClass("d-none");
carritoContenido.removeClass("d-none");


let html = "";

carrito.forEach(item => {

    const subtotal =
        item.precio * item.cantidad;


    html += `
        <div class="cart-item">

            <div class="cart-item-image">

                <img
                    src="${item.imagen}"
                    alt="${escapeHTML(item.nombre)}"
                >

            </div>

            <div class="cart-item-info">

                <h6>
                    ${escapeHTML(item.nombre)}
                </h6>

                <span class="cart-item-price">
                    S/ ${formatearPrecio(item.precio)}
                </span>

                <div class="cart-item-bottom">

                    <div class="quantity-control">

                        <button
                            class="cantidad-btn"
                            data-id="${item.id}"
                            data-accion="restar"
                            aria-label="Disminuir cantidad">

                            <i class="bi bi-dash"></i>

                        </button>

                        <span>
                            ${item.cantidad}
                        </span>

                        <button
                            class="cantidad-btn"
                            data-id="${item.id}"
                            data-accion="sumar"
                            aria-label="Aumentar cantidad">

                            <i class="bi bi-plus"></i>

                        </button>

                    </div>
                </div>

            </div>

            <button
                class="eliminar-item"
                data-id="${item.id}"
                aria-label="Eliminar producto">

                <i class="bi bi-trash"></i>

            </button>

        </div>
    `;
});


itemsCarrito.html(html);


const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
);


const total = carrito.reduce(
    (total, item) =>
        total + item.precio * item.cantidad,
    0
);


$("#cantidadTotal").text(cantidadTotal);

$("#totalCarrito").text(
    `S/ ${formatearPrecio(total)}`
);


}

function actualizarContador() {

const cantidad = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
);


$("#contadorCarrito").text(cantidad);


}

function obtenerCantidadProducto(id) {

const item = carrito.find(
    producto => producto.id === id
);

return item ? item.cantidad : 0;


}

/* ==========================================
LOCAL STORAGE
========================================== */

function guardarCarrito() {

localStorage.setItem(
    "carritoDulceEncanto",
    JSON.stringify(carrito)
);


}

/* ==========================================
WHATSAPP
========================================== */

function enviarPedidoWhatsApp() {

if (!carrito.length) {

    mostrarNotificacion(
        "Tu carrito está vacío."
    );

    return;
}


let mensaje =
    "🍰 *NUEVO PEDIDO - DULCE ENCANTO*%0A%0A";


carrito.forEach(item => {

    const subtotal =
        item.precio * item.cantidad;


    mensaje +=
        `• *${item.nombre}*%0A` +
        `  Cantidad: ${item.cantidad}%0A` +
        `  Precio: S/ ${formatearPrecio(item.precio)}%0A` +
        `  Subtotal: S/ ${formatearPrecio(subtotal)}%0A%0A`;
});


const total = carrito.reduce(
    (suma, item) =>
        suma + item.precio * item.cantidad,
    0
);


mensaje +=
    `━━━━━━━━━━━━━━━━%0A` +
    `💰 *TOTAL: S/ ${formatearPrecio(total)}*%0A%0A` +
    `Hola, quisiera realizar este pedido. ` +
    `¿Podrían confirmarme disponibilidad y detalles de entrega?`;


const url =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;


window.open(url, "_blank");


}

function abrirWhatsApp() {

const mensaje =
    "Hola, quisiera información sobre sus productos de Dulce Encanto. 🍰";


const url =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;


window.open(url, "_blank");


}

/* ==========================================
UTILIDADES
========================================== */

function formatearPrecio(precio) {

return Number(precio).toFixed(2);


}

function escapeHTML(texto) {

return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

function mostrarNotificacion(mensaje) {

const existente = document.querySelector(
    ".toast-dulce-encanto"
);

if (existente) {
    existente.remove();
}


const toast = document.createElement("div");

toast.className =
    "toast-dulce-encanto";


toast.innerHTML = `
    <i class="bi bi-check-circle-fill"></i>
    <span>${escapeHTML(mensaje)}</span>
`;


document.body.appendChild(toast);


setTimeout(() => {

    toast.classList.add("show");

}, 10);


setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {
        toast.remove();
    }, 300);

}, 2500);


}