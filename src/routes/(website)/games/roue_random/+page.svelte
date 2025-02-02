<script lang="ts">
	import { gsap } from 'gsap';
	import wheel from '$lib/images/wheel.png';

	const SEGMENTS = 5;
	const SEGMENT_NAMES = ['1 pts', '2 pts', '5 pts', 'Une rose', 'Soirée Kraken'];

	let spinning = false;
	let result: string | null = null;
	let wheelElement: HTMLImageElement;

	async function spinWheel() {
		if (spinning) return;
		spinning = true;

		try {
			// Appel de l'API
			const response = await fetch('/games/roue_random/api/spin');
			if (!response.ok) {
				throw new Error(`Erreur HTTP : ${response.status}`);
			}
			const { segment } = await response.json();

			// Calcul de la rotation
			const targetRotation = segment * 72 + 360 * 8; // 8 tours

			gsap.to(wheelElement, {
				rotation: targetRotation,
				duration: 4,
				ease: 'power3.out',
				onComplete: () => {
					spinning = false;
					result = SEGMENT_NAMES[segment];
				}
			});
		} catch (error) {
			console.error('Erreur:', error);
			spinning = false;
		}
	}
</script>

<!-- Le reste du code reste identique -->

<div class="container">
	<div class="wheel-frame">
		<img class="wheel" src={wheel} alt="Roue de la chance" bind:this={wheelElement} />

		<img class="arrow" src={wheel} alt="Flèche indicateur" />
	</div>

	<button on:click={spinWheel} disabled={spinning}>
		{spinning ? 'Rotation en cours...' : 'Jouer maintenant'}
	</button>

	{#if result}
		<div class="result-box">
			🎉 Résultat : <strong>{result}</strong>
		</div>
	{/if}
</div>

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
		margin: 2rem 0;
	}

	.wheel {
		width: 100%;
		height: 100%;
		transition: transform 0.1s;
	}

	.arrow {
		position: absolute;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		z-index: 2;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.05);
	}
</style>
