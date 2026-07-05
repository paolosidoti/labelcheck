# LabelCheck — CEVIQ
## App di ispezione etichette vino

---

## Struttura del progetto

```
labelcheck/
├── README.md          ← questo file, leggi prima di tutto
├── package.json       ← configurazione tecnica (non toccare)
├── server.js          ← motore dell'app (non toccare)
├── prompt.txt         ← KNOWLEDGE BASE — questo aggiorni tu
└── public/
    └── index.html     ← interfaccia utente (non toccare)
```

---

## I quattro file spiegati

### prompt.txt — IL FILE CHE GESTISCI TU
Contiene tutte le regole normative che Claude applica quando
analizza un'etichetta. È diviso in sezioni:

- **Ruolo**: definisce Claude come ispettore esperto
- **Sezione 1**: indicazioni obbligatorie (Art. 119 Reg. UE 1308/2013)
- **Sezione 2**: leggibilità e layout (Reg. UE 2019/33)
- **Sezione 3**: e-label e QR code
- **Sezione 4**: etichettatura ambientale
- **Sezione 5**: disciplinari specifici ← aggiungi qui le regole
  per denominazione quando hai i documenti ufficiali

**Come aggiornare la knowledge base:**
1. Apri `prompt.txt` con qualsiasi editor di testo
2. Vai alla Sezione 5 — Disciplinari specifici
3. Aggiungi le regole della denominazione seguendo il formato
   indicato nei commenti
4. Salva il file
5. La app usa le nuove regole dalla prossima analisi — nessun
   altro file da toccare, nessun riavvio necessario

---

### server.js — IL MOTORE (non modificare)
È il piccolo server che:
- Serve l'interfaccia agli ispettori che aprono il link
- Riceve le foto dal browser
- Legge il prompt da `prompt.txt`
- Aggiunge la chiave API (che rimane nascosta agli utenti)
- Chiama Claude e restituisce il report

Non va mai modificato per aggiornare le regole normative.
Va toccato solo se cambiano requisiti tecnici dell'app.

---

### public/index.html — L'INTERFACCIA (non modificare)
È la schermata che vedono gli ispettori sul telefono.
- Schermata 1: carica le foto e seleziona la categoria
- Schermata 2: mostra il report con i tre livelli di severità

Non va mai modificato per aggiornare le regole normative.

---

### package.json — CONFIGURAZIONE TECNICA (non toccare)
Dice alla piattaforma di hosting quali librerie installare
e come avviare il server. Non va mai modificato.

---

## Come fare il deploy

### Su Railway.app (raccomandato)
1. Crea un account su railway.app
2. Crea un nuovo progetto → "Deploy from GitHub"
3. Carica questi file su un repository GitHub
4. In Railway: Settings → Variables → aggiungi:
   - Nome: `ANTHROPIC_API_KEY`
   - Valore: la tua chiave `sk-ant-...`
5. Railway avvia il server automaticamente
6. Copia il link pubblico e mandalo agli ispettori

### Su Render.com (alternativa)
1. Crea un account su render.com
2. New → Web Service → connetti il repository GitHub
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables → aggiungi `ANTHROPIC_API_KEY`
6. Deploy → copia il link pubblico

---

## Costi stimati

| Voce | Costo |
|------|-------|
| Hosting (Railway piano gratuito) | 0 € |
| Per analisi singola (Sonnet 4.6) | ~0,03–0,08 € |
| 100 analisi al mese | ~3–8 € |
| 500 analisi al mese | ~15–40 € |

I costi API si monitorano su: console.anthropic.com → Usage

---

## Aggiornamento knowledge base — workflow

Quando arriva nuova documentazione normativa (disciplinari,
circolari ministeriali, note interpretative):

1. Porta i documenti in una sessione con Claude.ai
2. Claude estrae le regole rilevanti in formato strutturato
3. Copi le regole nella Sezione 5 di `prompt.txt`
4. Salvi il file e carichi su GitHub
5. Railway/Render fa il deploy automatico in 1-2 minuti

La chiave API resta sempre sul server.
Gli ispettori non vedono mai il prompt.
Solo tu puoi aggiornare le regole.

---

## Contatti tecnici
Progetto sviluppato nell'ambito del corso AI — CEVIQ
Per supporto tecnico: aggiornare tramite Claude.ai
