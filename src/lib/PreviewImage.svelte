<script>
	export let src;
</script>

<div class="flex content-center items-center">
	<img class="object-contain max-h-48" {src} alt="Preview" />
	<slot/>
</div>
