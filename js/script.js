function guardarYCambiarPagina(categoriaActual) {
    localStorage.setItem('categoriaSeleccionada', categoriaActual);
    console.log('Categoria seleccionada guardada:', categoriaActual);
    window.location.href = '/templates/productos.html';
}


// productos.html
// Obtener categoria    
const categoriaActual = localStorage.getItem('categoriaSeleccionada');

// Actualizar titulo
const title = document.querySelector('.title-category'); // Selecciona el primer elemento con clase "title"
if (title) {
    title.innerHTML = categoriaActual === 'all' ? 'Piezas' : categoriaActual; 
}

// Limpiar contenedor de productos
const container = document.getElementById('product-container');
container.innerHTML = '';

// Mostrar productos
const leerProductos = async () => {
    try {
        const response = await fetch("../js/productos.json");
        const productos = await response.json();

        // Filtrado de productos
        const productosFiltrados = categoriaActual === "all" ? productos : productos.filter(producto => producto.category == categoriaActual);

        productosFiltrados.forEach(producto => {
            const html = `
                <div class="product-item">
                <img src="../images/${producto.image}" alt="${producto.name}">
                <div class="product-caption">
                    <h4 class="title mb-small">${producto.name}</h4>
                    <a href="#" class="button">COMPRAR</a>
                </div>
            </div>
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