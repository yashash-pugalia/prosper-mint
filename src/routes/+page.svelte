<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<div class="mx-auto w-max flex flex-col gap-4 items-center" transition:fly={{ y: -10 }}>
		<h1
			class="text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-12"
		>
			Prosper Mint
		</h1>

		<h1 class="text-4xl font-semibold">Get in charge of your money.</h1>

		<Button href="/signup" class="mt-2">Get Started</Button>

		<p class="text-lg mt-8">
			Get a clear picture of your finances. So you can make better decisions and lead a healthier
			financial life.
		</p>

		<div class="flex border gap-2 p-2 rounded items-center mt-2">
			<div class="p-4">
				<p class="text-lg font-medium">Download the app</p>
				<p class="text-slate-500">Currently in invite only Beta</p>
			</div>
			<div class="bg-slate-200 w-20 h-20 rounded">
				<!-- add a QR code -->
			</div>
		</div>
	</div>
{/if}
