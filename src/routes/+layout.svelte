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
	<nav
		class="border-b -mx-4 -mt-4 p-1 px-4 flex flex-wrap justify-between items-center sticky top-0 z-50 bg-background"
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
	</nav>

	<!-- main page -->
	<slot />

	<footer class="flex -mx-4 -mb-4 px-4 p-1 gap-2 border-t">
		{#each [{ icon: 'mdi:twitter', href: 'https://twitter.com/yashash_pugalia' }, { icon: 'mdi:github', href: 'https://github.com/yashash-pugalia' }, { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/yashash-pugalia/' }] as e}
			<Button variant="ghost" size="icon" href={e.href}>
				<Icon icon={e.icon} class="text-xl" />
			</Button>
		{/each}
	</footer>
</div>
