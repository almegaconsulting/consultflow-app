import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { question, invoices, purchaseOrders, projects, timesheets, currency } =
      body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
Eres ConsultFlow AI, un asistente financiero para consultoras IT.

Reglas:
- Responde siempre en español.
- Usa moneda ${currency}.
- Usa formato europeo: 4.235,00 €.
- No respondas en un párrafo largo.
- Estructura siempre la respuesta con títulos claros.
- Usa este formato:

## Resumen ejecutivo
...

## Facturación
...

## POs
...

## Timesheets
...

## Margen
...

## Riesgos
...

## Recomendación
...

Analiza facturas, POs, timesheets y proyectos.
Si hay timesheets, úsalos para calcular coste real.
Si no hay timesheets, avisa claramente.
`,
        },
        {
          role: "user",
          content: `
Pregunta:
${question}

Proyectos:
${JSON.stringify(projects, null, 2)}

Facturas:
${JSON.stringify(invoices, null, 2)}

POs:
${JSON.stringify(purchaseOrders, null, 2)}

Timesheets:
${JSON.stringify(timesheets, null, 2)}
`,
        },
      ],
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("ERROR IA:", error);

    return Response.json(
      { error: error.message || "Error llamando a la IA" },
      { status: 500 }
    );
  }
}