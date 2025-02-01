<script lang="ts">
  import { gsap } from 'gsap';
  
  const SEGMENTS = 5;
  let spinning = false;
  let result: string | null = null;
  let wheelElement: HTMLImageElement;

  // Configuration de l'animation
  const FULL_ROTATIONS = 8; // Nombre de tours complets
  const DURATION = 4; // Secondes

  async function spin() {
    if (spinning) return;
    spinning = true;
    
    try {
      const response = await fetch('/api/spin');
      const { segment } = await response.json();
      
      // Calcul de la rotation finale
      const segmentDegrees = 360 / SEGMENTS;
      const targetRotation = (segment * segmentDegrees) + (FULL_ROTATIONS * 360);
      
      // Animation GSAP
      gsap.to(wheelElement, {
        rotation: targetRotation,
        duration: DURATION,
        ease: "power3.out",
        onComplete: () => {
          spinning = false;
          result = ["1 pts", "2 pts", "5 pts", "Rose", "Soirée Kraken"][segment];
        }
      });

    } catch (error) {
      console.error("Erreur:", error);
      spinning = false;
    }
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .wheel-frame {
    position: relative;
    width: 500px;
    height: 500px;
  }

  #wheel {
    width: 100%;
    height: 100%;
    transition: transform 0.1s; /* Pour l'instantiation GSAP */
  }

  .arrow {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
  }
</style>

<div class="container">
  <div class="wheel-frame">
    <img id="wheel" 
         src="/src/wheel.png" 
         alt="Roue de la chance"
         bind:this={wheelElement} />
         
    <img class="arrow"src="/src/wheel.png"  alt="Flèche">  <!-- Chemin corrigé -->
  </div>

  <button on:click={spin} disabled={spinning}>
    {spinning ? 'Rotation en cours...' : 'Jouer'}
  </button>

  {#if result}
    <div class="result">{result}</div>
  {/if}
</div>