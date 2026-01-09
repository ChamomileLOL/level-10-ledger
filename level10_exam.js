// level10_exam.js - THE AUTOMATED PROOF
const express = require('express');
const http = require('http');
const JSONbig = require('json-bigint')({ useNativeBigInt: true });

// 1. SETUP THE FORTRESS (The Server)
const app = express();
const PORT = 3001; // New port to avoid conflicts

// MIDDLEWARE: Reject standard parser, use Text -> BigInt
app.use(express.text({ type: 'application/json' }));

app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        try {
            // CRITICAL: Parse text to BigInt
            // If this line fails, the server rejects the request.
            req.body = JSONbig.parse(req.body);
            next();
        } catch (e) {
            res.status(400).send("JSON Error");
        }
    } else {
        next();
    }
});

app.post('/transaction', (req, res) => {
    const { id } = req.body;
    
    // DEBUG: Send back exactly what the server holds in memory
    // If id is a BigInt, this will preserve it.
    // If id is a Number, this will show the corrupted value.
    const safeResponse = JSONbig.stringify({ 
        status: "processed", 
        serverHeldId: id,
        typeDetected: typeof id
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(safeResponse);
});

const server = app.listen(PORT, () => {
    console.log(`[SYSTEM] Level 10 Server Active on Port ${PORT}...`);
    startAttack();
});

// 2. LAUNCH THE ATTACK (The Client)
function startAttack() {
    console.log("[SYSTEM] Launching 53-Bit Precision Attack...");
    
    // The dangerous payload (Text Format)
    const payload = '{"id": 9007199254740993, "amount": 5000}';
    
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/transaction',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
            analyzeResult(responseData);
        });
    });

    req.write(payload);
    req.end();
}

// 3. THE JUDGMENT (The Audit)
function analyzeResult(rawText) {
    console.log("\n------------------------------------------------");
    console.log("SERVER RESPONSE (RAW):", rawText);
    console.log("------------------------------------------------");

    // We look for the STRING sequence of the number
    if (rawText.includes("9007199254740993")) {
        console.log("🏆 RESULT: PASSED (Level 10 Certified)");
        console.log("✅ The Integer survived the round-trip.");
    } else {
        console.log("💀 RESULT: FAILED (Corrupted)");
        console.log("❌ The Integer was rounded to ...992");
    }
    
    console.log("------------------------------------------------");
    console.log("[SYSTEM] Shutting down.");
    server.close(); 
}