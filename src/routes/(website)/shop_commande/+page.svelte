<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { type PageServerData, type ActionData } from './$types.js';
  import { fade } from 'svelte/transition';

  let { data, form }: { data: PageServerData, form: ActionData } = $props();
  
  let orders = $state(data.ListeOrder);



  let prepare : {user:string,products: any[]}[] =$state([])
  let attendre  : {user:string,products: any[]}[] =$state([])
  let recuperer  : {user:string,products: any[]}[] =$state([])

  orders.forEach(order => {
    const [username, products, retrieved, wantToRetrieve] = order;
    if (retrieved) {
      recuperer.push({ user: username, products });
    } else if (wantToRetrieve) {
      prepare.push({ user: username, products });
    } else {
      attendre.push({ user: username, products });
    }
  });

  async function handleCheckboxClaim(item : {user:string,products: any[]}) {
    const formData = new FormData();
    formData.append('user', item.user);
    try {
      const data =await fetch('?/hasClaimed', { method: 'POST', body: formData });
      const reponse = await data.json();
      
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
    
  }

  async function handleCheckboxDislaim(item : {user:string,products: any[]}) {
    const formData = new FormData();
    formData.append('user', item.user);
    try {
      await fetch('?/DisClaimed', { method: 'POST', body: formData });
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  }

  $effect(() => {
    console.log(data.ListeOrder)
  })
</script>

<div class="p-4 flex flex-col max-h-[60vh] items-center">
  <div class="w-full max-w-screen-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
    <header class="text-2xl font-bold text-gray-800">📦 • Gestion des commandes</header>
    
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-blue-100 p-4 rounded-lg shadow-md max-h-[50vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-blue-700">À préparer ({prepare.length})</h3>
        <div class="space-y-4">
          {#each prepare as item}
            <div class="p-4 bg-white rounded-md shadow flex items-center space-x-4" in:fade>
              <input type="checkbox" onchange={() => handleCheckboxClaim(item)} />
              <div>
                <p class="font-medium text-gray-800">{item.user}</p>
                <div class="flex flex-wrap gap-1">
                  {#each item.products as prod}
                    <span class="bg-gray-300 px-2 py-1 rounded text-xs">{prod[0]} x {prod[1]}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="bg-yellow-100 p-4 rounded-lg shadow-md max-h-[50vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-yellow-700">En attente de confirmation ({attendre.length})</h3>
        <div class="space-y-4">
          {#each attendre as item}
            <div class="p-4 bg-white rounded-md shadow flex items-center space-x-4" in:fade>
              <input type="checkbox" onchange={() => handleCheckboxClaim(item)} />
              <div>
                <p class="font-medium text-gray-800">{item.user}</p>
                <div class="flex flex-wrap gap-1">
                  {#each item.products as prod}
                    <span class="bg-gray-300 px-2 py-1 rounded text-xs">{prod[0]} x {prod[1]}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="bg-green-100 p-4 rounded-lg shadow-md max-h-[40vh] overflow-y-auto mt-6">
      <h3 class="text-lg font-semibold text-green-700">Récupéré ({recuperer.length})</h3>
      <div class="space-y-4">
        {#each recuperer as item}
          <div class="p-4 bg-white rounded-md shadow flex items-center space-x-4" in:fade>
            <input type="checkbox" checked onchange={() => handleCheckboxDislaim(item)} />
            <div>
              <p class="font-medium text-gray-800">{item.user}</p>
              <div class="flex flex-wrap gap-1">
                {#each item.products as prod}
                  <span class="bg-gray-300 px-2 py-1 rounded text-xs">{prod[0]} x {prod[1]}</span>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
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
