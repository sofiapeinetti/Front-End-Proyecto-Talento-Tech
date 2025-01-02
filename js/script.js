function guardarYCambiarPagina(categoriaActual) {
    localStorage.setItem('categoriaSeleccionada', categoriaActual);
    console.log('Categoria seleccionada guardada:', categoriaActual);
    window.location.href = './templates/productos.html';
}


// productos.html
// Obtener categoria    
const categoriaActual = localStorage.getItem('categoriaSeleccionada') || 'all';

// Actualizar titulo
const title = document.querySelector('.title-category'); // Selecciona el primer elemento con clase "title"
if (title) {
    title.innerHTML = categoriaActual === 'all' ? 'Piezas' : categoriaActual; 
}

// Limpiar contenedor de productos
const container = document.getElementById('product-container');
if(container) container.innerHTML = ' ';

// Mostrar productos
const leerProductos = async () => {
    try {
        const response = await fetch("../js/productos.json");
        const productos = await response.json();

        // Filtrado de productos
        const productosFiltrados = categoriaActual === "all" ? productos : productos.filter(producto => producto.category == categoriaActual);
        
        productosFiltrados.forEach(producto => {
            const html = `
            <article class="product-item" data-id="${producto.id}">
                <img src="../images/${producto.image}" alt="${producto.name}">
                <div class="product-caption">
                    <h4 class="title">${producto.name}</h4>
                    <p class="title mb-small"> $${producto.price}</p>
                    <a href="#" class="button agregar">COMPRAR</a>
                </div>
            </article>
            `;

            container.innerHTML += html; // añade a los ya generados
        }
            
        );

    } catch (error) {
        console.log('Fallo: ', error);
    }
}

document.addEventListener('DOMContentLoaded', leerProductos);

// Fin productos.html


// Agregar al carrito

carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("agregar")) {
        console.log("click en agregar");
               
        // Busco el contenedor mas cercano que es un article y obtengo el id
        const id = event.target.closest("article").dataset.id;
        // Me fijo si ya esta cargado al carrito
        console.log("ID extraído 1:", id);
        const productoAdd = carrito.find((producto) => producto.id == id);
        console.log(productoAdd);
        
        if (productoAdd){
            productoAdd.cantidad++;
            console.log("ingreso a aggregar");
        }
        else { 
            console.log("ingreso a else");
            const leerProductosCarrito = async () => {
                try {
                    const response = await fetch("../js/productos.json");
                    const productos = await response.json();
                    // Busco el producto que se desea agregar
                    const productoSeleccionado = productos.find((producto) => producto.id == id);

                    if (productoSeleccionado){
                    //Me quedo solo con algunos datos del producto a agregar
                    const { name, color, price, image } = productoSeleccionado;
                    
                    const productoAdd = {
                        id: id,
                        name: name,
                        color: color,
                        price: price,
                        image: image,
                        cantidad: 1,
                    }
                    // Sumo producto al carrito
                    carrito.push(productoAdd);
                    }
                    else {
                        console.log("Producto seleccionado no encontrado");
                    }
                }
                catch (error) {
                    console.log("Error al traer producto")
                }
            };

            await leerProductosCarrito();  // sin esto no agrega el producto hasta que agrego otro
        }
        // Guardo el carrito transformado a texto en el navegador
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
});



//  Mostrar Carrito 
const botonCarrito = document.getElementById("boton-carrito");
const carritoContainer = document.getElementById("carrito-container");
const carritoProductos = document.querySelector(".carrito-productos");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const carritoFooter = document.querySelector(".carrito-footer");
const overlay = document.querySelector(".overlay");


botonCarrito.addEventListener('click', () => {
    console.log(carrito);
    overlay.style.visibility = "visible";
    carritoContainer.classList.add("open");

    let total = 0;

    carrito.forEach((producto) => {
        const html = `
        <div>
        <img src="../images/${producto.image}" alt="">
        <div class="producto-descripcion">
            <h4>${producto.name}</h4>
            <p>${producto.color}</p>
            <p>$${producto.price}</p>
            <button class="button">Eliminar</button>
        </div>
        </div>
        `;
        carritoProductos.innerHTML += html;
        total += producto.price;
    })

    carritoFooter.innerHTML = `<button class="button">Finalizar  ·  $${total}</button>`;
});

cerrarCarrito.addEventListener('click', () => {
    console.log("carrito cerrado");
    overlay.style.visibility = "hidden";
    carritoContainer.classList.remove("open");
});

// Fin carrito
