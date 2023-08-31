<script lang="ts">
	import '../app.postcss';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let showNav = true;

	onMount(() => {
		window.addEventListener('resize', () => {
			if (window.innerWidth < 640) showNav = false;
			else showNav = true;
		});
	});
</script>

<div class="max-w-screen-xl p-4 w-full mx-auto">
	<div
		class="border-b -mx-4 -mt-4 p-1 px-4 flex flex-wrap justify-between items-center sticky top-0 bg-background"
	>
		<a class="text-lg font-semibold" href="/">Prosper Mint</a>

		<Button variant="ghost" size="icon" on:click={() => (showNav = !showNav)} class="sm:hidden">
			<Icon icon="material-symbols:menu-rounded" class="text-xl" />
		</Button>

		{#if showNav}
			<div class="flex flex-col w-full sm:w-auto sm:flex-row" transition:slide>
				<Button variant="link">Team</Button>
				<Button variant="link">Manifest</Button>
				<Button variant="link">Blog</Button>
				<Button variant="link">Privacy</Button>
			</div>
		{/if}
	</div>
	<slot />
</div>
