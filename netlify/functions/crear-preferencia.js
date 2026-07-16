const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event, context) => {
  // Evitar problemas de CORS al hacer la petición desde el frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Inicializar Mercado Pago con el Token de Entorno de Netlify
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
    });
    
    const preference = new Preference(client);
    const body = JSON.parse(event.body);

    // Crear la preferencia con los datos del carrito
    const response = await preference.create({
  body: {
            items: body.items,
            back_urls: {
                success: `${body.baseUrl}/gracias.html?status=success&nombre=${encodeURIComponent(body.cliente.nombre)}&telefono=${encodeURIComponent(body.cliente.telefono)}&direccion=${encodeURIComponent(body.cliente.direccion)}`,
                failure: `${body.baseUrl}/carrito.html`,
                pending: `${body.baseUrl}/carrito.html`
            },
            auto_return: 'approved'
        }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: response.id })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};