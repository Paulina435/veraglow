// ===============================
// CARRITO VERA GLOW
// ===============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// ACTUALIZAR NUMERO DEL CARRITO

actualizarContador();



function agregarCarrito(nombre, precio){

carrito.push({
nombre: nombre,
precio: precio
});


localStorage.setItem(
"carrito",
JSON.stringify(carrito)
);


actualizarContador();


alert(nombre + " agregado al carrito 🛒");

}




function actualizarContador(){

let contador = document.getElementById("contadorCarrito");


if(contador){

contador.innerHTML = "(" + carrito.length + ")";

}

}




function mostrarCarrito(){

let contenido = document.getElementById("contenidoCarrito");


if(!contenido){
return;
}



if(carrito.length === 0){

contenido.innerHTML = `
<p>Tu carrito está vacío 🛒</p>
`;

return;

}



let total = 0;

let html = "";



carrito.forEach(producto => {


total += Number(producto.precio);



html += `

<div class="producto-carrito">

<h3>${producto.nombre}</h3>

<p>$${producto.precio} MXN</p>

<button onclick="eliminarProducto(${carrito.indexOf(producto)})">

❌ Eliminar

</button>

</div>

`;

});



html += `

<h2>Total: $${total} MXN</h2>


<button onclick="comprarWhatsApp()">

💬 Comprar por WhatsApp

</button>

`;



contenido.innerHTML = html;


}

function eliminarProducto(index){

carrito.splice(index,1);


localStorage.setItem(
"carrito",
JSON.stringify(carrito)
);


actualizarContador();


mostrarCarrito();


}


function comprarWhatsApp(){


let mensaje = "Hola Vera Glow, quiero comprar:%0A";


carrito.forEach(producto => {

mensaje += producto.nombre + 
" $" + producto.precio + " MXN%0A";

});



window.open(
"https://wa.me/525643454896?text=" + mensaje,
"_blank"
);


}