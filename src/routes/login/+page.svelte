<script>
	export let data;
</script>

<div class="hero mt-32">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				Seamlessly monitor your financial world with Prosper Mint, a dynamic personal finance
				tracking marvel. It transforms chaos into clarity, effortlessly handling expenses,
				investments, and cash flow. Unlock insights into your financial well-being and embark on a
				journey of smart financial habits.
			</p>
		</div>
		<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				{#if data.user}
					<form action="/logout" method="get">
						<button class="btn btn-primary w-full">Sign out</button>
					</form>
				{:else}
					<a class="btn btn-primary" href="/login/github">Sign in with GitHub</a>
				{/if}
			</div>
		</div>
	</div>
</div>
