<script lang="ts">
	import '../app.css';
	let { children }: { children: any } = $props();
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<div
	class="animate-gradient relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-500 via-yellow-400 to-orange-500"
>
	{@render children()}
</div>
<Toaster />

<style>
	@keyframes gradient {
		0% {
			background-position: 20% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 20% 50%;
		}
	}

	.animate-gradient {
		background-size: 200% 200%;
		animation: gradient 10s ease infinite;
	}
</style>
