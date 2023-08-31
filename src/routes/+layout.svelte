<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import 'tailwindcss/tailwind.css';

	let showNav = true;

	onMount(() => {
		window.addEventListener('resize', () => {
			if (window.innerWidth > 640) showNav = true;
			else showNav = false;
		});
	});
</script>

<div class="max-w-screen-xl p-4 w-full mx-auto min-h-screen">
	<nav
		class="border-b border-base-content/20 -mx-4 -mt-4 py-2 px-4 flex flex-wrap justify-between items-center sticky top-0 z-50 bg-base-200"
	>
		<a class="text-lg font-semibold" href="/">Prosper Mint</a>

		<button on:click={() => (showNav = !showNav)} class="btn btn-sm btn-ghost btn-square sm:hidden">
			<Icon icon="material-symbols:menu-rounded" class="text-xl" />
		</button>

		{#if showNav}
			<div class="flex gap-4 flex-col w-full sm:w-auto sm:flex-row" transition:slide>
				<label class="swap swap-rotate">
					<input type="checkbox" class="theme-controller" value="dark" />
					<Icon icon="material-symbols:sunny-outline-rounded" class="text-lg swap-on" />
					<Icon icon="material-symbols:nightlight-outline-rounded" class="text-lg swap-off" />
				</label>

				<a href="/signup" class="link link-hover">Sign Up</a>
				<a href="/app" class="link link-hover">App</a>
				<a href="/" class="link link-hover">Blog</a>
				<a href="/" class="link link-hover">Privacy</a>
			</div>
		{/if}
	</nav>

	<slot />

	<footer
		class="bg-base-200 flex -mx-4 -mb-4 px-4 p-1 gap-2 border-t border-base-content/20 sticky top-full"
	>
		{#each [{ icon: 'mdi:twitter', href: 'https://twitter.com/yashash_pugalia' }, { icon: 'mdi:github', href: 'https://github.com/yashash-pugalia' }, { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/yashash-pugalia/' }] as e}
			<a class="btn btn-sm btn-square btn-ghost" href={e.href}>
				<Icon icon={e.icon} class="text-xl" />
			</a>
		{/each}
	</footer>
</div>

<style>
	:global(body) {
		background-color: oklch(var(--b2));
		background-image: radial-gradient(oklch(var(--bc) / 20%) 5%, transparent 0);
		background-size: 48px 48px;
	}
</style>
