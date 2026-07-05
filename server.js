// ============================================================
// LABELCHECK — CEVIQ
// File: server.js
// Scopo: Server proxy tra il browser e l'API di Anthropic
//
// QUESTO FILE NON VA MODIFICATO NORMALMENTE.
// Fa tre cose soltanto:
// 1. Serve la app (index.html) agli utenti che aprono il link
// 2. Legge il prompt da prompt.txt a ogni richiesta
//    (così gli aggiornamenti alla knowledge base sono immediati)
// 3. Aggiunge la chiave API alle richieste verso Anthropic,
//    tenendola al sicuro lontano dal browser
//
// La chiave API non va scritta qui — va inserita come
// variabile d'ambiente ANTHROPIC_API_KEY sulla piattaforma
// di hosting (Railway, Render, ecc.)
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint principale: riceve foto + categoria dal browser,
// aggiunge il prompt e la chiave API, chiama Claude,
// restituisce il report JSON all'interfaccia
app.post('/api/analyze', async (req, res) => {

  // Controllo chiave API
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Chiave API non configurata. Aggiungere ANTHROPIC_API_KEY nelle variabili d\'ambiente.'
    });
  }

  // Lettura del prompt da file — avviene a ogni richiesta,
  // così gli aggiornamenti a prompt.txt sono immediati
  let promptTemplate;
  try {
    promptTemplate = fs.readFileSync(
      path.join(__dirname, 'prompt.txt'),
      'utf-8'
    );
  } catch (err) {
    return res.status(500).json({
      error: 'File prompt.txt non trovato. Verificare che il file esista nella cartella del progetto.'
    });
  }

  // Inserisce la categoria selezionata dall'ispettore nel prompt
  const { category, images } = req.body;
  if (!category || !images || images.length < 2) {
    return res.status(400).json({
      error: 'Richiesta incompleta. Necessarie: categoria e almeno 2 immagini.'
    });
  }

  const systemPrompt = promptTemplate.replace('{{CATEGORIA}}', category);

  // Costruisce il messaggio con le immagini
  const imageContent = images.map(img => ({
    type: 'image',
    source: {
      type: 'base64',
      media_type: img.mediaType,
      data: img.data
    }
  }));

  imageContent.push({
    type: 'text',
    text: 'Analizza queste immagini dell\'etichetta del vino e restituisci il report di conformità in formato JSON come specificato.'
  });

  // Chiamata all'API Anthropic
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: imageContent }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({
        error: err.error?.message || 'Errore API Anthropic'
      });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const report = JSON.parse(clean);

    res.json(report);

  } catch (err) {
    res.status(500).json({
      error: 'Errore durante l\'analisi: ' + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`LabelCheck CEVIQ in esecuzione su porta ${PORT}`);
});
