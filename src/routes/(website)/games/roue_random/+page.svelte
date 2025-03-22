<script lang="ts">
	import { gsap } from 'gsap';
	import wheel from '$lib/images/wheel.png';
	import fleche from '$lib/images/fleche.png';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	const SEGMENTS = 5;
	const SEGMENT_NAMES = [
		'2 points',
		'20 points, INCROYABLE!!🪙',
		'10 points',
		'6 points',
		'4 points'
	];

	let spinning = false;
	let intromsg = true;
	let result: string | null = null;
	let errorMessage: string | null = null;
	let wheelElement: HTMLImageElement;

	async function spinWheel() {
		intromsg = false;
		if (spinning) return;
		spinning = true;
		errorMessage = null; // Réinitialiser le message d'erreur

		try {
			// Appel de l'API
			const response = await fetch('/games/roue_random/api/spin');
			const data = await response.json();

			if (!response.ok) {
				// Si l'utilisateur ne peut pas jouer
				if (response.status === 403) {
					errorMessage = data.error; // Afficher le message d'erreur
				} else {
					throw new Error(`Erreur HTTP : ${response.status}`);
				}
				return;
			}
			// Si l'utilisateur peut jouer
			const { segment } = data;

			// Calcul de la rotation
			const targetRotation = segment * 72 + 360 * 8; // 8 tours

			gsap.to(wheelElement, {
				rotation: targetRotation,
				duration: 4,
				ease: 'power3.out',
				onComplete: () => {
					spinning = false;
					result = SEGMENT_NAMES[segment]; // Afficher le résultat
				}
			});
		} catch (error) {
			console.error('Erreur:', error);
			errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
			spinning = false;
		}
	}
</script>

<title>Krak'n Roses - RoueChanceuse</title>
<div class="container">
	<div class="wheel-frame">
		<img class="wheel" src={wheel} alt="Roue de la chance" bind:this={wheelElement} />
		<img class="arrow" src={fleche} alt="Flèche indicateur" />
	</div>

	{#if intromsg}
		<div style="margin-left: 2%;">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm"><b>Comment jouer ❔</b></Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>La Roue Chanceuse</Dialog.Title>
						<Dialog.Description>
							<br />
							HAHAHA ! Tu viens tenter ta <b>chance</b> ? <br /> <br />
							Très bien, voici le deal : tu peux gagner d'incroyables <b>récompenses</b>, et
							peut-être même un cadeau <b>secret</b>... 🎁 Mais attention, tu ne peux jouer qu'une
							fois toutes les 3 heures.
							<br /><br />
							Alors, reviens me voir et tente ta <b>chance</b> ! 🍀
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Close>
						<Button class="mt-2">Fermer</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}

	<br />
	<button on:click={spinWheel} disabled={spinning}>
		{spinning ? 'Rotation en cours...' : 'Jouer maintenant'}
	</button>

	{#if errorMessage}
		<div class="error-box">
			{errorMessage}
		</div>
	{/if}

	{#if result}
		<div class="result-box">
			Félicitations, vous avez gagné <strong>{result}</strong>
		</div>
	{/if}
</div>
<style>
	/* Conteneur principal centré */
	.container {
		top: -20%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		/* Pour laisser de l'espace en haut si une barre est présente en enfant */
		padding-top: 4rem;
		box-sizing: border-box;
	}

	/* Cadre de la roue en taille fixe max mais adaptatif */
	.wheel-frame {
		position: relative;
		/* Utilisation d'unités viewport pour s'adapter aux petits écrans */
		width: 90vw;
		max-width: 500px;
		height: 90vw;
		max-height: 500px;
	}

	/* La roue occupe tout le cadre */
	.wheel {
		
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		transition: transform 0.1s;
		z-index: -1;
	}

	/* La flèche est positionnée par-dessus, centrée horizontalement */
	.arrow {
		position: absolute;
		/* Placer la flèche légèrement au-dessus du centre */
		top: 0%;
		left: 50%;
		transform: translateX(-50%);
		/* Taille relative à la largeur du conteneur */
		width: 15%;
		z-index: -1;
		
	}

	/* Bouton principal */
	button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #e74c3c;
		color: white;
		margin-top: 1.5rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.05);
	}

	/* Styles pour les messages d'erreur et résultats */
	.error-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #ffebee;
		color: #c62828;
		border: 1px solid #c62828;
		border-radius: 8px;
	}

	.result-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #e8f5e9;
		color: #2e7d32;
		border: 1px solid #2e7d32;
		border-radius: 8px;
	}

	/* Adaptation pour les petits écrans */
	@media (max-width: 667px) {
		/* On augmente le padding pour compenser la barre si nécessaire */
		.container {
			padding: 1rem;
			padding-top: 4rem;
		}
		/* La roue reste de la même taille relative (90vw) mais le max-width est naturellement inférieur */
		.wheel-frame {
			width: 90vw;
			height: 90vw;
		}
		.wheel{
			
			margin-top: 10%;
		}

		
		/* Ajustement de la taille de la flèche si besoin */
		.arrow {
			width: 20%;
			top: 5%;
		}
		/* Bouton et autres éléments restent lisibles */
		button {
			font-size: 1rem;
			padding: 0.8rem 1.5rem;
		}
	}
</style>
