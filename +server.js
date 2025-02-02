// src/routes/api/spin/+server.js
export function GET() {
  const segments = [
    { weight: 60 }, // 1 pts
    { weight: 20 }, // 2 pts
    { weight: 10 }, // 5 pts
    { weight: 5 },  // Rose
    { weight: 5 }   // Soirée Kraken
  ];

  let total = segments.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * total;
  let cumulative = 0;

  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i].weight;
    if (random <= cumulative) {
      return new Response(JSON.stringify({ segment: i }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}