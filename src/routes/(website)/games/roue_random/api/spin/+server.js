export function GET() {
  const probabilities = [
    { weight: 60 }, 
    { weight: 5 }, 
    { weight: 5 },
    { weight: 10 },  
    { weight: 20 }   
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
