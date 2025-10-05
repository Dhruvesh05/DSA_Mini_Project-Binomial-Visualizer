import React, { useState } from "react";
import BinomialHeatmap from "./components/BinomialHeatmap";
import BinomialPyramid from "./components/BinomialPyramid";
import "./App.css";

export default function App() {
  const [n, setN] = useState("");
  const [k, setK] = useState("");
  const [result, setResult] = useState(null);
  const [view, setView] = useState("heatmap");

  const calculateNCR = (n, k) => {
    if (k > n) return 0;
    let C = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= Math.min(i, k); j++)
        C[i][j] = j === 0 || j === i ? 1 : C[i - 1][j - 1] + C[i - 1][j];
    return C[n][k];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateNCR(parseInt(n), parseInt(k)));
  };

  return (
    <div className="container">
      <h1>Binomial Coefficient Visualizer</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="number" placeholder="Enter n" value={n} onChange={(e) => setN(e.target.value)} required />
        <input type="number" placeholder="Enter k" value={k} onChange={(e) => setK(e.target.value)} required />
        <button type="submit">Calculate</button>
      </form>

      {result !== null && (
        <>
          <h2>
            C({n}, {k}) = {result}
          </h2>

          <div className="view-toggle">
            <button onClick={() => setView("heatmap")} className={view === "heatmap" ? "active" : ""}>
              Heatmap
            </button>
            <button onClick={() => setView("pyramid")} className={view === "pyramid" ? "active" : ""}>
              3D Pyramid
            </button>
          </div>

          {view === "heatmap" && <BinomialHeatmap n={parseInt(n)} k={parseInt(k)} />}
          {view === "pyramid" && <BinomialPyramid n={parseInt(n)} k={parseInt(k)} />}
        </>
      )}
    </div>
  );
}
