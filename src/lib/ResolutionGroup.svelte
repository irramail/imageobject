<script>
	export let resolutions = [];
	export let group = [];
</script>

{#each resolutions as value}
	<label class="grow shrink basis-1/4">
		<input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" bind:group {value} checked />
		<span class="ml-2 text-gray-700">
			{value}
		</span>
	</label>
{/each}
