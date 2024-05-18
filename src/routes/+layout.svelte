<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import 'tailwindcss/tailwind.css';
	import { themeChange } from 'theme-change';
	import './app.pcss';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let showNav = true;

	let theme: 'system' | 'dark' | 'light' = 'system';

	export let data;

	onMount(() => {
		window.addEventListener('resize', () => {
			if (window.innerWidth > 640) showNav = true;
			else showNav = false;
		});

		themeChange(false);

		let tl = localStorage.getItem('theme') as '' | 'light' | 'dark' | null;
		if (tl) theme = tl;
	});
</script>

<Toaster {theme} />

<div class="max-w-screen-xl p-4 w-full mx-auto min-h-screen">
	<nav
		class="border-b -mx-4 -mt-4 py-2 px-4 flex flex-wrap justify-between items-center sticky top-0 z-50 bg-base-300"
	>
		<a class="text-lg font-semibold" href="/">Prosper Mint</a>

		<button on:click={() => (showNav = !showNav)} class="btn btn-sm btn-ghost btn-square sm:hidden">
			<Icon icon="material-symbols:menu-rounded" class="text-xl" />
		</button>

		{#if showNav}
			<div class="flex rounded gap-2 flex-col w-full sm:w-auto sm:flex-row" transition:slide>
				{#if data.user}
					<a
						href="/portfolio"
						class="btn btn-sm"
						class:btn-active={$page.route.id === '/portfolio'}
					>
						<Icon icon="material-symbols:monitoring-rounded" />
						Portfolio
					</a>
					<a
						href="/transactions"
						class="btn btn-sm"
						class:btn-active={$page.route.id === '/transactions'}
					>
						<Icon icon="material-symbols:featured-play-list-outline-rounded" />
						Transactions
					</a>
					<a href="/banks" class="btn btn-sm" class:btn-active={$page.route.id === '/banks'}>
						<Icon icon="material-symbols:account-balance-outline-rounded" />
						Banks
					</a>
				{:else}
					<a href="/login" class="btn btn-sm" class:btn-active={$page.route.id === '/login'}>
						<Icon icon="material-symbols:login-rounded" />
						Sign Up
					</a>
				{/if}
			</div>
		{/if}
	</nav>

	<slot />

	<footer class="bg-base-200 flex -mx-4 -mb-4 px-4 p-1 gap-2 border-t sticky top-full">
		{#each [{ icon: 'mdi:twitter', href: 'https://twitter.com/yashash_pugalia' }, { icon: 'mdi:github', href: 'https://github.com/yashash-pugalia' }, { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/yashash-pugalia/' }] as e}
			<a class="btn btn-sm btn-square btn-ghost" href={e.href}>
				<Icon icon={e.icon} class="text-xl" />
			</a>
		{/each}

		<div class="flex rounded-full ml-auto">
			<button
				class="btn btn-sm btn-circle btn-ghost"
				data-set-theme="dark"
				data-act-class="btn-active"
			>
				<Icon icon="material-symbols:nightlight-outline-rounded" class="text-lg" />
			</button>
			<button
				class="btn btn-sm btn-circle btn-ghost"
				data-set-theme="light"
				data-act-class="btn-active"
			>
				<Icon icon="material-symbols:sunny-outline-rounded" class="text-lg" />
			</button>
			<button class="btn btn-sm btn-circle btn-ghost" data-set-theme="" data-act-class="btn-active">
				<Icon icon="material-symbols:desktop-windows-outline-rounded" class="text-lg" />
			</button>

			<button class="btn-active hidden">so svelte doesn't remove btn-active css</button>
		</div>
	</footer>
</div>

<style lang="postcss">
	/* looks cool just the buttom moving around */
	nav a.btn-active {
		view-transition-name: active-page;
	}
</style>
