// ===============================
// CARRITO VERA GLOW
// ===============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualizar contador al cargar
actualizarContador();

// ===============================
// AGREGAR PRODUCTO
// ===============================

function agregarCarrito(nombre, precio) {

    let productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre,
            precio: Number(precio),
            cantidad: 1
        });
    }

    guardarCarrito();

    alert(nombre + " agregado al carrito 🛒");
}

// ===============================
// GUARDAR
// ===============================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarContador();

    if(document.getElementById("contenidoCarrito")){
        mostrarCarrito();
    }

}

// ===============================
// CONTADOR
// ===============================

function actualizarContador(){

    let contador = document.getElementById("contadorCarrito");

    if(!contador) return;

    let totalProductos = 0;

    carrito.forEach(producto=>{
        totalProductos += producto.cantidad;
    });

    contador.innerHTML = "(" + totalProductos + ")";

}

// ===============================
// MOSTRAR CARRITO
// ===============================

function mostrarCarrito(){

    let contenido = document.getElementById("contenidoCarrito");

    if(!contenido) return;

    if(carrito.length===0){

        contenido.innerHTML=`
        <p>Tu carrito está vacío 🛒</p>
        `;

        return;
    }

    let subtotal = 0;

    let html="";

    carrito.forEach((producto,index)=>{

        let totalProducto=producto.precio*producto.cantidad;

        subtotal+=totalProducto;

        html+=`

        <div class="producto-carrito">

            <h3>${producto.nombre}</h3>

            <p>$${producto.precio} MXN</p>

            <div class="cantidad">

                <button onclick="disminuirCantidad(${index})">−</button>

                <span>${producto.cantidad}</span>

                <button onclick="aumentarCantidad(${index})">+</button>

            </div>

            <p><strong>Subtotal:</strong> $${totalProducto} MXN</p>

            <button onclick="eliminarProducto(${index})">
                ❌ Eliminar
            </button>

        </div>

        `;
    });

    // DESCUENTO

    let descuento = subtotal * 0.10;

    let total = subtotal - descuento;

    html += `

    <hr>

    <h3>Subtotal: $${subtotal.toFixed(2)} MXN</h3>

    <h3 style="color:#d77fa1;">
    Descuento (10%): -$${descuento.toFixed(2)}
    </h3>

    <h3>Envío CDMX y Edo. Méx.: GRATIS 🚚</h3>

    <h2>Total: $${total.toFixed(2)} MXN</h2>

 <div class="acciones-carrito">

    <button onclick="comprarMercadoPago()" class="btn-pagar">
        💳 Pagar con Mercado Pago
    </button>

    <button onclick="comprarWhatsApp()" class="btn-whatsapp">
        💬 Pedir por WhatsApp
    </button>

</div>

    `;

    contenido.innerHTML=html;

}

// ===============================
// CANTIDADES
// ===============================

function aumentarCantidad(index){

    carrito[index].cantidad++;

    guardarCarrito();

}

function disminuirCantidad(index){

    carrito[index].cantidad--;

    if(carrito[index].cantidad<=0){

        carrito.splice(index,1);

    }

    guardarCarrito();

}

// ===============================
// ELIMINAR
// ===============================

function eliminarProducto(index){

    carrito.splice(index,1);

    guardarCarrito();

}

// ===============================
// MERCADO PAGO
// ===============================

function comprarMercadoPago(){

    alert("En el siguiente paso conectaremos Mercado Pago.");

}function comprarWhatsApp(){

    let mensaje = "¡Hola! Quiero realizar el siguiente pedido:%0A%0A";

    carrito.forEach(producto=>{

        mensaje +=
        producto.nombre +
        " x" +
        producto.cantidad +
        " - $" +
        (producto.precio * producto.cantidad) +
        " MXN%0A";

    });

    window.open(
        "https://wa.me/525643454896?text="+mensaje,
        "_blank"
    );
}
async function comprarMercadoPago() {
    // 1. Verificar si el carrito tiene productos
    if (!carrito || carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    // 2. Mapear tus productos al formato de Mercado Pago
    const itemsDelCarrito = carrito.map(prod => ({
        title: prod.nombre,       
        quantity: prod.cantidad,   
        unit_price: Number(prod.precio) 
    }));

    try {
        // 3. Llamar a tu función en Netlify
        const response = await fetch('/.netlify/functions/crear-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: itemsDelCarrito,
                baseUrl: window.location.origin
            })
        });

        const data = await response.json();
        
        if (data.id) {
            // 4. Redirigir al checkout seguro
            window.location.href = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${data.id}`;
        } else {
            alert("Hubo un error al procesar el pago. Intenta de nuevo.");
        }
    } catch (error) {
        console.error("Error al conectar con Mercado Pago:", error);
        alert("No se pudo conectar con la pasarela de pagos.");
    }
}