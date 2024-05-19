<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
</script>

<h1 class="text-3xl font-mono my-4">
	Hi {data.user?.username}
</h1>

<div class="flex gap-4">
	<aside class="flex flex-col w-96 bg-base-200 min-h-96 rounded border p-2 gap-2">
		<div class="flex gap-2 items-center">
			<Icon icon="material-symbols:account-balance-outline-rounded" class="text-xl" /> Banks
			<a class="btn btn-xs ml-auto btn-ghost" href="/banks">See All</a>
		</div>

		{#each data.banks as bank}
			<div class="border rounded p-2 flex gap-2 items-center bg-base-100">
				<img class="w-8 h-8" src="/bank-logos/{bank.name}.png" alt="" />
				<div class="grow">
					<h2 class="flex justify-between gap-2 font-semibold">
						<span class="truncate shrink">
							{bank.name}
						</span>

						<span
							>{bank.balance.toLocaleString('en-IN', {
								style: 'currency',
								currency: 'INR',
								signDisplay: 'never'
							})}
						</span>
					</h2>

					<p class="text-sm font-thin">
						Savings **** {bank.accountNo.slice(-4)}
					</p>
				</div>
			</div>
		{/each}
	</aside>

	<main class="border p-2 rounded bg-base-200 grow flex flex-col gap-2">
		<div class="flex gap-2 items-center">
			<Icon icon="material-symbols:featured-play-list-outline-rounded" class="text-xl" /> Recent Transactions

			<a class="btn btn-xs btn-ghost ml-auto" href="/transactions">See All</a>
		</div>

		{#each data.transactions as transaction}
			<div class="border rounded p-2 flex gap-2 items-center bg-base-100">
				{transaction.amount.toLocaleString('en-IN', {
					style: 'currency',
					currency: 'INR',
					signDisplay: 'always'
				})}

				<p class="ml-auto">
					{transaction.createdAt.toLocaleString('default', { month: 'short', day: 'numeric' })}
				</p>
			</div>
		{/each}
	</main>
</div>
