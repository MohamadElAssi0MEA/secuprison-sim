export function evaluateLearner(actions, correctSequence) {
  // actions: array of event ids in order user remediated/interacted
  // correctSequence: expected event order (array)
  let matched = 0;
  for (let i=0;i<actions.length;i++) {
    if (actions[i] === correctSequence[i]) matched++;
  }
  const accuracy = actions.length ? (matched / actions.length) : 0;
  const result = {
    timestamp: new Date().toISOString(),
    actions,
    accuracy,
    matched,
    total: actions.length
  };
  saveResult("learnerResults", result);
  return result;
}

export function evaluateOperator(logs) {
  // logs: array of detailed event objects from simulation replay
  // compute latency and mapping accuracy mock
  const avgLatency = (logs.reduce((s,l)=>s+(l.latency||0),0) / (logs.length||1));
  const mappingAccuracy = logs.filter(l=>l.mappedCorrect).length / (logs.length||1);
  const result = {
    timestamp: new Date().toISOString(),
    avgLatency,
    mappingAccuracy,
    processed: logs.length
  };
  saveResult("operatorResults", result);
  return result;
}

function saveResult(key, data) {
  const all = JSON.parse(localStorage.getItem(key) || "[]");
  all.push(data);
  localStorage.setItem(key, JSON.stringify(all));
}

export function exportResultsCSV(key) {
  const all = JSON.parse(localStorage.getItem(key) || "[]");
  if (!all.length) return null;
  const headers = Object.keys(all[0]);
  const rows = all.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","));
  return headers.join(",") + "\n" + rows.join("\n");
}
