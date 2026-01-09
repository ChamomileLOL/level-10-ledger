// server.js - THE PERSISTENT FORTRESS
const express = require('express');
const JSONbig = require('json-bigint')({ useNativeBigInt: true });
const cors = require('cors'); // We need this for React to talk to Node

const app = express();
const PORT = 3001;

app.use(cors()); // Allow the Frontend to connect

// THE LEVEL 10 MIDDLEWARE
app.use(express.text({ type: 'application/json' }));
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        try {
            req.body = JSONbig.parse(req.body);
            next();
        } catch (e) { res.status(400).send("JSON Error"); }
    } else { next(); }
});

app.post('/transaction', (req, res) => {
    const { id } = req.body;
    console.log(`[SERVER] Received ID: ${id.toString()}`); // Proof in Console
    
    const response = JSONbig.stringify({ 
        status: "processed", 
        serverHeldId: id 
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`[SYSTEM] Level 10 Server Waiting on Port ${PORT}...`);
});