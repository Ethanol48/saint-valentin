export function GET() {
  const probabilities = [
    { weight: 60 }, // 1 pts (index 0)
    { weight: 20 }, // 2 pts (index 1)
    { weight: 10 }, // 5 pts (index 2)
    { weight: 5 },  // Rose (index 3)
    { weight: 5 }   // Soirée (index 4)
  ];

  const total = probabilities.reduce((sum, p) => sum + p.weight, 0);
  const random = Math.random() * total;

  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i].weight;
    if (random <= cumulative) {
      return new Response(JSON.stringify({ segment: i }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Si aucune valeur n'est trouvée (improbable)
  return new Response(JSON.stringify({ segment: 0 }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
