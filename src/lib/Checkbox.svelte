<script>
    export let value;
    export let group = undefined;
</script>

<label class="grow shrink basis-1/3">
	<input type="radio" class="form-checkbox h-5 w-5 text-gray-600" bind:group value checked />
	<span class="ml-2 text-gray-700">
		{value}
	</span>
</label>
