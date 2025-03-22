<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import svelte from '$lib/svgs/svelte-icon.svg';
	import shadcn from '$lib/images/shadcn.png';

  let { class: classes = "", style: styles = "" } = $props();
</script>

<div class={classes} style={styles}>
  <div class="flex w-full items-center justify-center gap-2" style="font-size: 12px;">
    <p>Made with</p>
    <i class="fa-solid fa-heart text-[#bf2222]"></i>
    <p style="margin: 0px;">using</p>
    <img src={svelte} class="size-4" alt="svelte" />
    <p style="margin: 0px;">and</p>
    <img src={shadcn} class="size-4 rounded" alt="svelte-shadcn" />
  </div>
</div>

