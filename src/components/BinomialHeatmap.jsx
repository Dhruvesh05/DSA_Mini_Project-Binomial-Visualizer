import React, { useEffect, useState } from "react";
import "./BinomialHeatmap.css";

export default function BinomialHeatmap({ n, k }) {
  const [triangle, setTriangle] = useState([]);

  useEffect(() => {
    const t = [];
    for (let i = 0; i <= n; i++) {
      const row = [];
      for (let j = 0; j <= i; j++) {
        row.push(j === 0 || j === i ? 1 : t[i - 1][j - 1] + t[i - 1][j]);
      }
      t.push(row);
    }
    setTriangle(t);
  }, [n]);

  const maxVal = Math.max(...triangle.flat());

  return (
    <div className="heatmap">
      {triangle.map((row, i) => (
        <div key={i} className="heatmap-row" style={{ animationDelay: `${i * 0.1}s` }}>
          {row.map((val, j) => (
            <div
              key={j}
              className={`cell ${i === n && j === k ? "highlight" : ""}`}
              style={{
                backgroundColor: `hsl(${(val / maxVal) * 240}, 80%, 50%)`,
                transition: "transform 0.3s, background-color 0.5s, box-shadow 0.3s",
              }}
              title={`C(${i},${j}) = ${val}`}
            >
              {val}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
