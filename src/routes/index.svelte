<script>
	import Dropzone from 'svelte-file-dropzone';
	import { fetchData, defaultData, imgUrl } from '$lib/api';
	import PreviewImage from '$lib/PreviewImage.svelte';
	import { Circle2 } from 'svelte-loading-spinners';
import Input from '$lib/Input.svelte';

	let image;
	let imageStatus;
	let html = '';

	function fileSelect({ detail: { acceptedFiles } }) {
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.addEventListener('load', function () {
			image = reader.result;
			imageStatus = 'local';
			sendImage(image);
		});

		reader.readAsDataURL(file);
	}

	async function sendImage(base64) {
		const res = await fetchData('api', {
			body: JSON.stringify({
				...defaultData,
				params: [base64]
			})
		});

		imageStatus = 'server';
		getScheme();
	}

	async function getScheme() {
		const res = await fetchData('api', {
			body: JSON.stringify({
				...defaultData,
				method: 'get_schema_org'
			})
		});

		const { result } = await res.json();
		html = result;
	}
</script>

<svelte:head>
	<title>ImageObject - Schema.org Generator</title>
</svelte:head>

<h1 class="mt-4 text-slate-900 text-4xl tracking-tight font-extrabold sm:text-3xl ">
	ImageObject - <a
		class="text-blue-500 hover:text-blue-500 visited:text-blue-500"
		href="https://schema.org/">Schema.org</a
	>
	Generator
</h1>

<ol class="list-decimal mt-4">
	<li>Заполнить все однострочные поля.</li>
	<li>Отметить форматы изображения.</li>
	<li>Нажать кнопку Set, чтобы сохранить и отправить настройки на сервер.</li>
	<li>Справа вверху нажать на кнопку Upload Images и выбрать изображение формата JPG.</li>
	<li>Подождать пока в многострочном текстовом поле появится сгенерированный html текст.</li>
	<li>
		Чтобы скачать архив с изображениями, следует нажать по ссылке Download (расположена внизу
		рабочей области).
	</li>
	<li>
		Поменять любое из полей или выбрать другой набор разрешений, нажать Retry, процесс генерации
		будет запущен повторно с последним загруженным изображением.
	</li>
</ol>

<form class="mt-4">
	<div class="grid xl:grid-cols-2 xl:gap-6">
		<Input id="https://site.example"/>
		<Input id="images"/>
	</div>
	<Input id="alt"/>
	<Input id="meta"/>
	<Input id="desc"/>
	<Input id="thumbnail"/>
	<button
		type="submit"
		class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>Submit</button
	>
</form>

<div class="flex content-center items-center mt-4">
	{#if imageStatus == 'local'}
		<PreviewImage src={image}>
			<div class="px-4">
				<Circle2 size="60" color="#FF3E00" unit="px" duration="1s" />
			</div>
			<span class="text-green-500">Изображение загружается</span>
		</PreviewImage>
	{:else if imageStatus == 'server'}
		<PreviewImage src={imgUrl}>
			<span class="px-4 text-blue-300">Изображение загружено</span>
		</PreviewImage>
	{:else}
		<Dropzone
			on:drop={fileSelect}
			accept="image/*"
			multiple={false}
			containerClasses="dropzone"
			containerStyles="background-color: #1d4ed8"
		/>
	{/if}
</div>

<textarea class="mt-4 min-h-[200px] border-2 border-indigo-500/100 w-full">
	{html}
</textarea>

<style>
	:global(.dropzone) {
		@apply mt-4;
	}
</style>
