<script>
	import Dropzone from 'svelte-file-dropzone';
	import { Circle2 } from 'svelte-loading-spinners';
	import Clipboard from 'svelte-clipboard';
	import { fetchData, defaultData, imgUrl, downloadUrl } from '$lib/api';
	import { onInterval } from '$lib/utils';
	import PreviewImage from '$lib/PreviewImage.svelte';
	import InputText from '$lib/InputText.svelte';
	import ImageHeader from '$lib/ImageHeader.svelte';
	import Button from '$lib/Button.svelte';
	import ResolutionGroup from '$lib/ResolutionGroup.svelte';

	let image;
	let imageStatus;
	let html = '';
	let settings = {
		site: '',
		img: '',
		thumb: '',
		alt: '',
		meta: '',
		desc: ''
	};

	let aspectRes = [
		['1:1', ['320x320', '640x640', '1280x1280', '1920x1920']],
		['4:3', ['320x240', '640x480', '1280x960', '1920x1440']],
		['16:9', ['320x180', '640x360', '854x480', '1280x720', '1920x1080']]
	];

	let resolutions
	 = [
		'320x320',
		'640x640',
		'1280x1280',
		'1920x1920',
		'320x240',
		'640x480',
		'1280x960',
		'1920x1440',
		'320x180',
		'640x360',
		'854x480',
		'1280x720',
		'1920x1080'
	];

	let checkedResolution = resolutions;

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
		try {
			await fetchData('api', {
				body: JSON.stringify({
					...defaultData,
					params: [base64],
					method: 'set_img'
				})
			});
			imageStatus = 'server';
			getScheme();
		} catch (error) {
			console.error('send image error', error);
			imageStatus = 'server';
		}
	}

	async function existImg() {
		try {
			const res = await fetchData('api', {
				body: JSON.stringify({
					...defaultData,
					method: 'exists_img'
				})
			});

			const { result } = await res.json();
			if (result === 'false') {
				getScheme();
			}
		} catch (error) {
			console.error('exist image error');
		}
	}

	async function getScheme() {
		try {
			const res = await fetchData('api', {
				body: JSON.stringify({
					...defaultData,
					method: 'get_schema_org'
				})
			});

			const { result } = await res.json();
			html = result;
		} catch (error) {
			console.error('get scheme network error');
		}
	}

	async function sendSettings(data) {
		try {
			await fetchData('api', {
				body: JSON.stringify({
					...defaultData,
					method: 'set',
					params: [data]
				})
			});
		} catch (error) {
			console.error('set settings network error');
		}
	}

	function formateResolution() {
		let out = '';

		for (let aspect of aspectRes) {
			let str = [];
			for (let resol of aspect[1]) {
				if (checkedResolution.includes(resol)) {
					str.push(resol);
				}
			}

			if (str.length > 0) {
				out += `${aspect[0]}_${str.join()};`;
			}
		}

		// Удаление конечной ; проверять бы что это ; но не охото
		if (out.length > 0) return out.slice(0, -1);

		return out;
	}

	async function settingsSubmit() {
		const { site, img, thumb, alt, meta, desc } = settings;
		let data = `${site}|${img}|${thumb}|${alt}|${meta}|${desc}|`;
		data += formateResolution();
		await sendSettings(data);
	}

	async function retry() {
		settingsSubmit();
		html = '';
		imageStatus = 'load';
		try {
			await fetchData('api', {
				body: JSON.stringify({
					...defaultData,
					method: 'reTry'
				})
			});
			imageStatus = 'server';
		} catch (error) {
			imageStatus = 'error';
			console.error('retry network error');
		}
	}

	onInterval(existImg, 3000);
</script>

<ImageHeader />

<form class="mt-4" on:submit|preventDefault={settingsSubmit}>
	<div class="grid xl:grid-cols-2 xl:gap-6">
		<InputText id="site.example" bind:inputvalue={settings.site} />
		<InputText id="images" bind:inputvalue={settings.img} />
	</div>
	<InputText id="alt" bind:inputvalue={settings.alt} />
	<InputText id="meta" bind:inputvalue={settings.meta} />
	<InputText id="desc" bind:inputvalue={settings.desc} />
	<InputText id="thumbnail" bind:inputvalue={settings.thumb} />

	<div class="flex  justify-center items-center flex-wrap">
		<ResolutionGroup { resolutions } bind:group={checkedResolution}/>
	</div>

	<Button type="submit">Submit</Button>
	<Button on:click={retry} className="mt-4" bgBlue={false}>Retry</Button>
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
		<!-- url функцией чтобы менялась дата-->
		<PreviewImage src={imgUrl()}>
			<span class="px-4 text-blue-300">Изображение загружено</span>
			<form method="get" action={downloadUrl}>
				<Button type="submit">Скачать</Button>
			</form>
		</PreviewImage>
	{:else if imageStatus == 'load'}
		<div class="px-4">
			<Circle2 size="60" color="#FF3E00" unit="px" duration="1s" />
		</div>
		<span class="text-green-500">Изображение перезагружается</span>
	{:else if imageStatus == 'error'}
		<p class="text-red-500">Невозможно соединиться с сервером попробуйте повторить чуть позже</p>
	{:else}
		<Dropzone
			on:drop={fileSelect}
			accept="image/*"
			multiple={false}
			containerClasses="dropzone"
			containerStyles="background-color: #1d4ed8"
		>
			<p>Выберите или перенесите файл</p>
		</Dropzone>
	{/if}
</div>

<Clipboard text={html} let:copy>
	<Button on:click={copy} className="mt-4">Копировать</Button>
</Clipboard>

<textarea class="mt-4 min-h-[200px] border-2 border-indigo-500/100 w-full">
	{html}
</textarea>

<style>
	:global(.dropzone) {
		@apply mt-4;
	}
</style>
