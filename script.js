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

        let totalProducto = producto.precio * (producto.cantidad || 1);

        subtotal+=totalProducto;

        html+=`

        <div class="producto-carrito">

            <h3>${producto.nombre}</h3>

            <p>$${producto.precio} MXN</p>

            <div class="cantidad">

                <button onclick="disminuirCantidad(${index})">−</button>

               <span>${producto.cantidad || 1}</span>

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

 <div class="formulario-datos" style="text-align: left; margin: 20px 0; background: #fffafc; padding: 15px; border-radius: 8px; border: 1px solid #f3e5eb;">
  <h4 style="color: #4a3b40; margin-bottom: 10px; font-size: 1rem;">Datos de Envío / Contacto</h4>
  <div style="margin-bottom: 10px;">
    <label style="font-size: 0.8rem; color: #7d6870; display:block;">Nombre Completo</label>
    <input type="text" id="nombre-cliente" placeholder="Ej. Paulina Gómez" style="width:100%; padding: 8px; border: 1px solid #e2d1d8; border-radius: 6px;">
  </div>
  <div style="margin-bottom: 10px;">
    <label style="font-size: 0.8rem; color: #7d6870; display:block;">Teléfono (WhatsApp)</label>
    <input type="tel" id="telefono-cliente" placeholder="Ej. 5512345678" style="width:100%; padding: 8px; border: 1px solid #e2d1d8; border-radius: 6px;">
  </div>
  <div style="margin-bottom: 10px;">
    <label style="font-size: 0.8rem; color: #7d6870; display:block;">Dirección Completa</label>
    <input type="text" id="direccion-cliente" placeholder="Calle, Número, Colonia, C.P." style="width:100%; padding: 8px; border: 1px solid #e2d1d8; border-radius: 6px;">
  </div>
</div>

<div class="acciones-carrito" style="display: flex; flex-direction: column; gap: 10px;">
  <button onclick="comprarMercadoPago()" class="btn-pago btn-mercadopago" style="width: 100%; padding: 12px; border: none; border-radius: 25px; background: #4a3b40; color: white; font-weight: 500; cursor: pointer;">
     Animar y Pagar con Mercado Pago
  </button>
  <button onclick="comprarWhatsApp()" class="btn-pago btn-whatsapp" style="width: 100%; padding: 12px; border: none; border-radius: 25px; background: #e2d1d8; color: #4a3b40; font-weight: 500; cursor: pointer;">
     Pedir por WhatsApp
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


   

function comprarWhatsApp() {
    // 1. Obtener datos del formulario que acabamos de crear
    const nombre = document.getElementById("nombre-cliente").value.trim();
    const telefono = document.getElementById("telefono-cliente").value.trim();
    const direccion = document.getElementById("direccion-cliente").value.trim();

    // 2. Validar que los campos no estén vacíos
    if (!nombre || !telefono || !direccion) {
        alert("Por favor, completa todos tus datos de envío antes de continuar.");
        return;
    }

    if (!carrito || carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // 3. Formatear la lista de productos para el mensaje
    let listaProductos = "";
    carrito.forEach(prod => {
        const cantidad = prod.cantidad || 1;
        const subtotalItem = Number(prod.precio) * cantidad;
        listaProductos += `• ${prod.nombre} (x${cantidad}) - $${subtotalItem} MXN\n`;
    });

    // Calcular totales con descuento del 10%
    const subtotal = carrito.reduce((acc, prod) => acc + (Number(prod.precio) * (prod.cantidad || 1)), 0);
    const descuento = subtotal * 0.10;
    const total = subtotal - descuento;

    // 4. Redactar el mensaje de confirmación súper limpio y profesional para VERA GLOW
    const mensaje = `✨ *CONFIRMACIÓN DE PEDIDO - VERA GLOW* ✨\n\n` +
                    `¡Hola! Me gustaría confirmar mi compra con los siguientes detalles:\n\n` +
                    `👤 *Cliente:* ${nombre}\n` +
                    `📞 *Teléfono:* ${telefono}\n` +
                    `📍 *Dirección de envío:* ${direccion}\n\n` +
                    `🛍️ *Detalle del Pedido:*\n${listaProductos}\n` +
                    `📉 *Descuento aplicado (10%):* -$${descuento.toFixed(2)} MXN\n` +
                    `💰 *Total a pagar:* $${total.toFixed(2)} MXN\n\n` +
                    `*Estado:* Pendiente de confirmación de pago.`;

    // Tu número de WhatsApp de VERA GLOW al que llegará el pedido (escríbelo sin espacios ni guiones)
    // Nota: El prefijo de México es 52. Si es celular, pon 521 seguido de tus 10 dígitos.
    const tuNumeroWhatsApp = "5643454896"; // <-- CAMBIA ESTO por tu número real

    // 5. Crear enlace de WhatsApp y abrirlo en una pestaña nueva
    const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
}
async function comprarMercadoPago() {
    // 1. Verificar si el carrito tiene productos
    if (!carrito || carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

   // 2. Mapear tus productos al formato de Mercado Pago (Aplicando el 10% de descuento)
    const itemsDelCarrito = carrito.map(prod => {
        const precioConDescuento = Number(prod.precio) * 0.90; // Resta el 10%
        return {
            title: prod.nombre,       
            quantity: prod.cantidad || 1,   
            unit_price: precioConDescuento 
        };
    });

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