<script>
	export let type = 'button';
	export let className = null;
	export let bgBlue = true;
	let blue = 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300';
	let green = 'bg-green-500 hover:bg-green-600 focus:ring-green-300';
</script>

<button
	{type}
	on:click
	class="text-white focus:border-white focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
		{bgBlue? blue : green} {className}"
>
	<slot />
</button>
