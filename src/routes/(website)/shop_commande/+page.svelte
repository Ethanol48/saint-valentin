<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';

  import { type PageServerData, type ActionData } from './$types.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button';
  import { slide, fade } from 'svelte/transition';
	import { redirect } from '@sveltejs/kit';

  let { data, form }: { data: PageServerData, form: ActionData } = $props();

  let orders = data.ListeOrder;

  let categories = $state([
    { name: "À préparer", items: [], expanded: false },
    { name: "En attente de confirmation", items: [], expanded: false },
    { name: "Récupéré", items: [], expanded: false },
  ]);

  orders.forEach(order => {
    const [username, products, retrieved, wantToRetrieve] = order;
    let categoryName;
    if (retrieved) {
      categoryName = "Récupéré";
    } else if (wantToRetrieve) {
      categoryName = "À préparer";
    } else {
      categoryName = "En attente de confirmation";
    }

    const cat = categories.find(cat => cat.name === categoryName);
    cat.items.push({
      user: username,
      products, 
    });
  });

  function toggleCategory(index: number) {
    categories[index].expanded = !categories[index].expanded;
    categories = categories;
  }

  async function handleCheckboxClaim(item) {
  const formData = new FormData();
  formData.append('user', item.user);
  
  try {
    const response = await fetch('?/DisClaimed', { // Remplace par la route correcte
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('Erreur lors de la mise à jour de la commande');
    }
    
    window.location.reload();
  } catch (error) {
    console.error('Erreur réseau:', error);
  }
}


async function handleCheckboxDislaim(item) {
  const formData = new FormData();
  formData.append('user', item.user);
  
  try {
    const response = await fetch('?/hasClaimed', { // Remplace par la route correcte
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('Erreur lors de la mise à jour de la commande');
    }
    
    window.location.reload();
  } catch (error) {
    console.error('Erreur réseau:', error);
  }
}
</script>

<div class="flex flex-col p-4">
  <div class="flex flex-col w-full max-w-screen-xl flex-grow bg-white rounded-xl shadow-lg overflow-hidden max-h-[70vh]">
    <header class="p-6 border-b">
      <h2 class="text-2xl font-bold text-gray-800">📦 • Gestion des commandes</h2>
    </header>

    <main class="flex-grow overflow-y-auto p-6 space-y-4">
      {#each categories as category, index}
        <div class="border rounded-lg overflow-hidden">
          <button
            on:click={() => toggleCategory(index)}
            class="w-full flex justify-between items-center px-6 py-4 font-semibold transition-colors
              {category.name === 'Récupéré'
                ? 'bg-pink-400 text-white hover:bg-pink-600'
                : 'bg-gradient-to-r from-pink-300 to-pink-400 text-white hover:from-pink-400 hover:to-pink-500'}"
          >
            <span>{category.name}</span>
            <span class="text-sm">({category.items.length})</span>
          </button>
          {#if category.expanded}
            <div transition:slide class="bg-gray-50 p-4 space-y-3">
              {#each category.items as item}
                <div class="flex items-center space-x-4 p-4 bg-white rounded-md shadow hover:shadow-md transition-shadow" in:fade={{duration:300}}>
                  <input
                    type="checkbox"
                    class="h-5 w-5 text-blue-600 form-checkbox"
                    on:change={() => category.name === 'Récupéré'
                    ? handleCheckboxClaim(item)
                    : handleCheckboxDislaim(item)}
                    checked={category.name === "Récupéré"}
                  />
                  <div class="flex-1">
                    <p class="text-gray-800 font-medium">{item.user}</p>
                    <div class="flex flex-wrap gap-1">
                      {#each item.products as prod}
                        <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {prod[0]} x {prod[1]}
                        </span>
                      {/each}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </main>
  </div>
</div>


<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
