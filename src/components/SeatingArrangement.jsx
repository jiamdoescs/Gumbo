// src/components/SeatingArrangement.jsx
import React, { useState, useEffect } from "react";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs";

export default function SeatingArrangement({ guests }) {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("similar"); // "similar" or "different"

  useEffect(() => {
    if (!guests || guests.length < 2) return;

    const computePairs = async () => {
      setLoading(true);
      try {
        const model = await use.load();
        const sentences = guests.map(g => g.funnyAnswer || "");
        const embeddings = await model.embed(sentences);
        const vectors = await embeddings.array();

        // Compute similarity matrix
        const sims = vectors.map((vecA, i) =>
          vectors.map((vecB, j) => {
            if (i === j) return 0;
            const dot = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
            const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
            const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
            return dot / (magA * magB);
          })
        );

        const assigned = new Set();
        const suggestedPairs = [];

        for (let i = 0; i < guests.length; i++) {
          if (assigned.has(i)) continue;
          let bestMatch = -1;
          let bestScore = mode === "similar" ? -1 : 2; // max cosine similarity = 1
          for (let j = 0; j < guests.length; j++) {
            if (i === j || assigned.has(j)) continue;
            const score = sims[i][j];
            if (
              (mode === "similar" && score > bestScore) ||
              (mode === "different" && score < bestScore)
            ) {
              bestScore = score;
              bestMatch = j;
            }
          }
          if (bestMatch >= 0) {
            suggestedPairs.push([guests[i], guests[bestMatch], bestScore]);
            assigned.add(i);
            assigned.add(bestMatch);
          } else {
            suggestedPairs.push([guests[i], null, 0]);
            assigned.add(i);
          }
        }

        setPairs(suggestedPairs);
      } catch (err) {
        console.error("Error computing seating:", err);
      } finally {
        setLoading(false);
      }
    };

    computePairs();
  }, [guests, mode]);

  if (loading) return <p>Calculating seating arrangement...may take a couple of seconds</p>;
  if (!guests || guests.length === 0) return <p>No guests yet.</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2></h2>

      <div style={{ marginBottom: "1rem" }}>
        <button className="button"
  onClick={() => setMode("similar")}
 
>
  Pair similar guests
</button>

<button className = "button "
  onClick={() => setMode("different")}
  
>
  Pair very different guests
</button>

      </div>

      {pairs.length === 0 && <p>Not enough data to suggest pairs.</p>}
      <ul>
        {pairs.map((pair, idx) => (
          <li key={idx} style={{ marginBottom: "0.5rem" }}>
            {pair[0].name}{" "}
            {pair[1]
              ? `& ${pair[1].name} (score: ${pair[2].toFixed(2)})`
              : "(no pair)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
