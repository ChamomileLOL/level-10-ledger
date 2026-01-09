// attack.js - THE TRUTH SERUM
// const fetch = require('node-fetch'); // If using older Node, or just use built-in fetch in Node 18+

// 1. WE FORCE THE PAYLOAD AS A STRING. 
// If we used { id: 9007199254740993 }, JS would round it immediately.
const dangerousPayload = '{"id": 9007199254740993, "amount": 5000}';

console.log("------------------------------------------------");
console.log("CLIENT SENDING RAW STRING: " + dangerousPayload);

fetch('http://localhost:3000/transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: dangerousPayload
})
.then(res => res.text()) // 2. WE READ AS TEXT (Do not use res.json() or it will round again!)
.then(text => {
    console.log("SERVER RESPONSE (RAW TEXT):", text);
    
    // 3. WE CHECK FOR THE STRING "993", NOT THE NUMBER
    if (text.includes("9007199254740993")) {
        console.log("RESULT: ✅ PASSED. The Server preserved the BigInt.");
    } else {
        console.log("RESULT: ❌ FAILED. The Server corrupted the data.");
    }
    console.log("------------------------------------------------");
})
.catch(err => console.error(err));