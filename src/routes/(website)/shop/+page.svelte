<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
</script>

<title>Krak'n Roses - Shop</title>
<div class="flex w-2/4 flex-col justify-center">
	<h1 class="typography mb-3 ml-auto mr-auto text-lg text-gray-900">SHOP</h1>

	<br /><br />
	<h3 style="text-align: center; font-size:20px">
		Un shop arrive dès mercredi matin! <br /><br />De nombreuses récompenses seront disponibles
		alors préparez vos points car les stocks sont limités ! 🎁
	</h3>
</div>

<style lang="postcss">
	tr {
		@apply m-0 border-t p-0 even:bg-muted;
	}

	td {
		@apply border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right;
	}

	th {
		@apply border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right;
	}
</style>
