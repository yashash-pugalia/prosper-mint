<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let loaded = false;

	onMount(() => (loaded = true));
</script>

<div class="mx-auto w-full">
	<!-- just to get transition working -->
	{#if loaded}
		<section
			class="flex flex-col gap-4 items-center min-h-[calc(100vh-50px)] border-b"
			transition:slide
		>
			<h1
				class="text-6xl sm:text-8xl lg:text-9xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-12"
			>
				Prosper Mint
			</h1>

			<h2 class="text-2xl sm:text-4xl lg:text-5xl font-semibold">Get in charge of your money.</h2>

			<a class="btn btn-neutral mt-2" href="/app">Get Started</a>

			<p class="text-lg mt-8 text-center">
				Get a clear picture of your finances. So you can make better decisions and lead a healthier
				financial life.
			</p>

			<div class="flex border gap-2 p-2 rounded items-center mt-2">
				<div class="p-4">
					<p class="text-lg font-medium">Download the app</p>
					<p class="text-slate-500">Currently in invite only Beta</p>
				</div>
				<div class="bg-base-200 w-20 h-20 rounded">
					<!-- add a QR code -->
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-4 items-center min-h-[calc(100vh-50px)] border-b">
			<img src="screenshot.png" alt="" class="w-3/4 -translate-y-1/4" />

			<h2 class="text-2xl sm:text-4xl lg:text-5xl font-semibold">
				Your Passport to Financial Mastery.
			</h2>

			<p class="text-lg opacity-60 w-3/4">
				Seamlessly monitor your financial world with Prosper Mint, a dynamic personal finance
				tracking marvel. It transforms chaos into clarity, effortlessly handling expenses,
				investments, and cash flow. Unlock insights into your financial well-being and embark on a
				journey of smart financial habits.
			</p>

			<p>Your compass in the sea of finance, your mentor to financial prowess.</p>
		</section>
	{/if}
</div>
