import { useState } from 'react';
import JSONbig from 'json-bigint'; 
import './App.css'; 

function App() {
  const [displayId, setDisplayId] = useState("Waiting...");

  const handleTransaction = async () => {
    try {
      const payload = '{"id": 9007199254740993, "amount": 5000}';
      
      const res = await fetch('https://level-10-api-xyz.onrender.com/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });

      const text = await res.text();
      const data = JSONbig.parse(text);
      
      setDisplayId(data.serverHeldId.toString());
    } catch (err) {
      setDisplayId("ERROR: Is Server Running?");
    }
  };

  return (
    <div className="grid-shell">
      <header className="header-zone"><h1>Level 10 Ledger</h1></header>
      <main className="content-zone">
        <div className="card flex-column">
          <h2>Transaction Audit</h2>
          <button className="trigger-btn" onClick={handleTransaction}>
            SEND 9007199254740993
          </button>
          <div className="display-screen">
            <span className="label">SERVER RETURNED:</span>
            <div className="value">{displayId}</div>
          </div>
          {displayId.includes('993') && <p className="success">✅ PASSED: INTEGRITY SAVED</p>}
          {displayId.includes('992') && <p className="failure">❌ FAILED: DATA CORRUPTED</p>}
        </div>
      </main>
    </div>
  );
}
export default App;