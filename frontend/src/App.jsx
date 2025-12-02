import React, { useState, useEffect } from "react";
import ControlPanel from "./components/ControlPanel";
import PrisonMap from "./components/PrisonMap";
import eventsData from "./data/events.json";
import { evaluateLearner, evaluateOperator, exportResultsCSV } from "./utils/evaluator";

export default function App() {
  const [mode, setMode] = useState("Learner");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [learnerActions, setLearnerActions] = useState([]);

  useEffect(()=> {
    // reset when mode changes
    setLogs([]);
    setLearnerActions([]);
    setRunning(false);
  }, [mode]);

  function onStart() {
    setLogs([]);
    setLearnerActions([]);
    setRunning(true);
  }
  function onReset() {
    setLogs([]);
    setLearnerActions([]);
    setRunning(false);
  }

  function onEventLog(log) {
    setLogs(prev => [...prev, log]);
    // in Learner Mode we simulate that user "handles" an event when token reaches it
    if (mode === "Learner") {
      setLearnerActions(prev => [...prev, log.id]);
    }
  }

  function onEvaluate() {
    if (mode === "Learner") {
      const correct = eventsData.map(e => e.id);
      const res = evaluateLearner(learnerActions, correct);
      alert(`Learner Eval: accuracy ${(res.accuracy*100).toFixed(1)}%`);
    } else {
      const res = evaluateOperator(logs);
      alert(`Operator Eval: avg latency ${res.avgLatency.toFixed(1)}ms, mapping accuracy ${(res.mappingAccuracy*100).toFixed(1)}%`);
    }
  }

  function exportLearnerCSV() {
    const csv = exportResultsCSV("learnerResults");
    if (!csv) { alert("No learner results saved"); return; }
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "learner_results.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2>SecuPrison</h2>
        <p>7-layer OSI simulation with one mapped MITRE technique per layer.</p>
        <ControlPanel
          mode={mode}
          setMode={setMode}
          events={eventsData}
          onStart={onStart}
          onReset={onReset}
          onEvaluate={onEvaluate}
          exportLearnerCSV={exportLearnerCSV}
        />
        <div style={{marginTop:18}}>
          <h4>Instructor notes</h4>
          <ul>
            <li>Use Learner Mode for guided sequence and pre/post test.</li>
            <li>Use Operator Mode to capture logs & mapping metrics.</li>
          </ul>
        </div>
      </div>
      <div className="canvas">
        <PrisonMap events={eventsData} running={running} onEventLog={onEventLog} />
      </div>
    </div>
  );
}
