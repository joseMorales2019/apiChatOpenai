const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar OpenAI con clave desde variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ⚠️ NO pongas la clave directamente en producción
});

// Ruta de verificación para Render
app.get('/', (req, res) => {
  res.send('✅ API Chat OpenAI está funcionando.');
});

// Ruta para manejar mensajes del cliente
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje vacío.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error al llamar a OpenAI:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Puerto para Render o local
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});
