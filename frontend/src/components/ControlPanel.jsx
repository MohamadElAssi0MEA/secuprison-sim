import React from "react";

export default function ControlPanel({
  mode, setMode, events, onStart, onReset, onEvaluate, exportLearnerCSV
}) {
  return (
    <div>
      <div className="mode-flag">Mode: {mode}</div>
      <div>
        <button onClick={() => setMode("Learner")}>Learner Mode</button>
        <button onClick={() => setMode("Operator")}>Operator Mode</button>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={onStart}>Start Simulation</button>
        <button onClick={onReset}>Reset</button>
        <button onClick={onEvaluate}>Run Evaluation</button>
        <button onClick={exportLearnerCSV}>Export Learner CSV</button>
      </div>

      <h4 style={{marginTop:12}}>Events (one per layer)</h4>
      <div className="event-list">
        {events.map(e => (
          <div key={e.id} style={{padding:6, borderBottom:"1px solid #eee"}}>
            <strong>Layer {e.layer}</strong> — {e.name} <br/>
            <small>{e.mitre} | {e.analogy}</small>
            <div style={{fontSize:12, color:"#555"}}>{e.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
