<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let allStocks: { prevClose: Number; symbol: String; companyName: String }[] = [];

	onMount(async () => {
		allStocks = await fetch('https://api-cache.yashash.dev/stocks.json')
			.then((r) => r.json())
			.then((r) => r.data.filter((s) => s.symbol !== 'NIFTY 500'))
			.then((s) =>
				s.map((s) => ({
					prevClose: s.previousClose,
					symbol: s.meta.symbol,
					companyName: s.meta.companyName
				}))
			);

		console.log(allStocks);
	});

	export let data;
	console.log(data);

	let stockModal: HTMLDialogElement;
	let mutualFundModal: HTMLDialogElement;
	let fdModal: HTMLDialogElement;
	let addInvestments: HTMLDialogElement;
	onMount(() => {
		addInvestments = document.getElementById('addInvestments') as HTMLDialogElement;
	});
	// Sample data for investments
	let data2 = {
		mutualFunds: [
			{ name: 'Fund A', amount: 15000 },
			{ name: 'Fund B', amount: 12000 }
		],
		fds: [
			{ name: 'FD A', amount: 20000 },
			{ name: 'FD B', amount: 25000 }
		]
	};

	// Helper function to calculate total investment
	const calculateTotal = (investments) =>
		investments.reduce((total, investment) => total + investment.amount, 0);

	onMount(() => {
		stockModal = document.getElementById('stockModal') as HTMLDialogElement;
		mutualFundModal = document.getElementById('mutualFundModal') as HTMLDialogElement;
		fdModal = document.getElementById('fdModal') as HTMLDialogElement;
	});
</script>

<div class="flex flex-wrap gap-4 py-4">
	<!-- Portfolio Stocks -->
	<div class="bg-base-100 rounded border grow">
		<div class="flex gap-2 items-center border-b px-4 py-2">
			<span class="font-semibold text-lg">Portfolio Stocks</span>
			<span class="ml-auto font-bold text-green-600">₹{calculateTotal(data.investments)}</span>
			<button class="btn btn-ghost btn-square btn-sm" on:click={() => stockModal.showModal()}>
				<Icon icon="material-symbols:info-outline" class="text-lg" />
			</button>
		</div>
	</div>

	<!-- Mutual Funds -->
	<div class="bg-base-100 rounded border grow">
		<div class="flex gap-2 items-center border-b px-4 py-2">
			<span class="font-semibold text-lg">Mutual Funds</span>
			<span class="ml-auto font-bold text-green-600">₹{calculateTotal(data2.mutualFunds)}</span>
			<button class="btn btn-ghost btn-square btn-sm" on:click={() => mutualFundModal.showModal()}>
				<Icon icon="material-symbols:info-outline" class="text-lg" />
			</button>
		</div>
	</div>

	<!-- Fixed Deposits -->
	<div class="bg-base-100 rounded border grow">
		<div class="flex gap-2 items-center border-b px-4 py-2">
			<span class="font-semibold text-lg">Fixed Deposits</span>
			<span class="ml-auto font-bold text-green-600">₹{calculateTotal(data2.fds)}</span>
			<button class="btn btn-ghost btn-square btn-sm" on:click={() => fdModal.showModal()}>
				<Icon icon="material-symbols:info-outline" class="text-lg" />
			</button>
		</div>
	</div>
</div>

<!-- Modals -->
<dialog id="stockModal" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Portfolio Stocks</h3>
		<ul>
			{#each data.investments ?? [] as stock}
				<li>{stock.name}: ₹{stock.amount}</li>
			{/each}
		</ul>
		<p class="font-bold mt-4">Total: ₹{calculateTotal(data.investments)}</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>

<dialog id="mutualFundModal" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Mutual Funds</h3>
		<ul>
			{#each data2.mutualFunds as fund}
				<li>{fund.name}: ₹{fund.amount}</li>
			{/each}
		</ul>
		<p class="font-bold mt-4">Total: ₹{calculateTotal(data2.mutualFunds)}</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>

<dialog id="fdModal" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Fixed Deposits</h3>
		<ul>
			{#each data2.fds as fd}
				<li>{fd.name}: ₹{fd.amount}</li>
			{/each}
		</ul>
		<p class="font-bold mt-4">Total: ₹{calculateTotal(data2.fds)}</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
<button class="btn btn-primary" on:click={() => addInvestments.showModal()}>
	Add new Investment
</button>

<dialog id="addInvestments" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

		<!-- when request complete close dialoge -->
		<form
			class="flex flex-col gap-2"
			action="?/add"
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					addInvestments.close();
				};
			}}
		>
			<h3 class="font-bold text-lg">Add Bank Account</h3>

			<label class="form-control">
				<span class="label-text">Stock:</span>
				<select class="select select-bordered" name="name" required>
					<option disabled selected>Select Stock</option>
					{#each allStocks as e}
						<option value={e.symbol}>{e.companyName}</option>
					{/each}
				</select>
			</label>
			<label class="form-control">
				<span class="label-text">Purchase Price:</span>
				<input
					type="number"
					class="input input-bordered"
					name="amount"
					placeholder="Type here"
					required
				/>
			</label>
			<label class="form-control">
				<span class="label-text">Quantity:</span>
				<input type="text" class="input input-bordered" placeholder="Type here" name="quantity" />
			</label>
			<button class="btn btn-primary" type="submit">Save</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
