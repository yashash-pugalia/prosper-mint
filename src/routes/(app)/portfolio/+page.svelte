<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

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
	const calculateTotal = (investments: { amount: number }[]) =>
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

			<button class="btn btn-ghost btn-square btn-sm" on:click={() => addInvestments.showModal()}>
				<Icon icon="material-symbols:add-circle" class="text-lg" />
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data.investments ?? [] as stock (stock.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{stock.name}</span>
						<span class="font-bold text-green-600">₹{stock.amount * stock.prevClose}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Quantity: {stock.quantity}</p>
						<p>Buy Price: ₹{stock.amount}</p>
						<p>Last Trading Price: ₹{stock.prevClose ?? 'N/A'}</p>
					</div>
					<button class="btn btn-outline btn-sm mt-4"> View Details </button>
				</div>
			{/each}
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
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data2.mutualFunds ?? [] as fund (fund.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{fund.name}</span>
						<span class="font-bold text-green-600">₹{fund.amount}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Units: {fund.quantity}</p>
						<p>Net Asset Value (NAV): ₹{fund.nav ?? 'N/A'}</p>
					</div>
					<button class="btn btn-outline btn-sm mt-4"> View Details </button>
				</div>
			{/each}
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
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data2.fds ?? [] as fd (fd.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{fd.name}</span>
						<span class="font-bold text-green-600">₹{fd.amount}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Term: {fd.term}</p>
						<p>Interest Rate: {fd.interestRate}</p>
					</div>
					<button class="btn btn-outline btn-sm mt-4"> View Details </button>
				</div>
			{/each}
		</div>
	</div>
</div>

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
					{#each data.allStocks ?? [] as e}
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
