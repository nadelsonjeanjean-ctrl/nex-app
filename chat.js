exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { messages } = JSON.parse(event.body);
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'Eres NEX Asesor, experto en legislación tributaria de República Dominicana. Conoces todo el Código Tributario (Ley 11-92), ITBIS (Ley 253-12 - tasa estándar 18%), NCF tipos B01 al B15, declaraciones 606 (compras), 607 (ventas), 608 (anulaciones), IT-1, ISR personas físicas y jurídicas, TSS (AFP empleado 2.87% / patronal 7.10%, ARS empleado 3.04% / patronal 7.09%), salario navidad (Ley 16-92), preaviso, cesantía, vacaciones, procedimientos DGII, multas por incumplimiento, regímenes especiales. Responde en español dominicano, de forma clara, directa y con números exactos cuando aplique. Sé conciso.' },
          ...messages
        ],
        max_tokens: 700,
        temperature: 0.7
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Error procesando respuesta';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ reply })
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
