<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

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

	const calculateTotal = (
		investments: { quantity: number; prevClose?: number; amount: number }[]
	) =>
		investments.reduce(
			(total, investment) =>
				total +
				investment.quantity * (investment.prevClose ? investment.prevClose : investment.amount),
			0
		);

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
			<span class="ml-auto font-bold text-green-600"
				>₹{calculateTotal(data.investments.filter((i) => i.type === 'stocks'))}</span
			>

			<button class="btn btn-ghost btn-square btn-sm" on:click={() => addInvestments.showModal()}>
				<Icon icon="material-symbols:add-circle" class="text-lg" />
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data.investments.filter((i) => i.type === 'stocks') ?? [] as stock (stock.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{stock.name}</span>
						<span class="font-bold text-green-600">₹{stock.quantity * stock.prevClose}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Quantity: {stock.quantity}</p>
						<p>Buy Price: ₹{stock.amount}</p>
						<p>Last Trading Price: ₹{stock.prevClose ?? 'N/A'}</p>
					</div>

					<form
						class="tooltip tooltip-left ml-auto"
						data-tip="Remove this Stock"
						action="?/delete"
						method="post"
						use:enhance
					>
						<input type="hidden" value={stock.id} name="id" />
						<button class="btn btn-ghost btn-square btn-sm" type="submit">
							<Icon icon="material-symbols:delete-outline-rounded" class="text-lg" />
						</button>
					</form>

					{#if stock.showChart}
						<img transition:slide src={stock.chart365dPath} alt="" />
					{/if}

					<button
						class="btn btn-outline btn-sm mt-4"
						on:click={() =>
							(stock.showChart = stock.showChart === undefined ? true : !stock.showChart)}
					>
						View/Hide Price Graph
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Mutual Funds -->
	<div class="bg-base-100 rounded border grow">
		<div class="flex gap-2 items-center border-b px-4 py-2">
			<span class="font-semibold text-lg">Mutual Funds</span>
			<span class="ml-auto font-bold text-green-600"
				>₹{calculateTotal(data.investments.filter((i) => i.type === 'mf'))}</span
			>
			<button class="btn btn-ghost btn-square btn-sm" on:click={() => addMutual.showModal()}>
				<Icon icon="material-symbols:add-circle" class="text-lg" />
			</button>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data.investments.filter((i) => i.type === 'mf') ?? [] as fund (fund.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{fund.name}</span>
						<span class="font-bold text-green-600">₹{fund.amount * fund.quantity}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Units: {fund.quantity}</p>
						<p>Net Asset Value (NAV): ₹{fund.amount ?? 'N/A'}</p>
					</div>

					<form
						class="tooltip tooltip-left ml-auto"
						data-tip="Remove this Mutual Fund"
						action="?/delete"
						method="post"
						use:enhance
					>
						<input type="hidden" value={fund.id} name="id" />
						<button class="btn btn-ghost btn-square btn-sm" type="submit">
							<Icon icon="material-symbols:delete-outline-rounded" class="text-lg" />
						</button>
					</form>
				</div>
			{/each}
		</div>
	</div>

	<!-- Fixed Deposits -->
	<div class="bg-base-100 rounded border grow">
		<div class="flex gap-2 items-center border-b px-4 py-2">
			<span class="font-semibold text-lg">Fixed Deposits</span>
			<span class="ml-auto font-bold text-green-600">
				<span>
					₹{data.investments
						.filter((i) => i.type === 'fd')
						.reduce((total, fd) => total + (fd.amount + (fd.amount * 7 * fd.quantity) / 100), 0)}
				</span>				
			</span>
			<button class="btn btn-ghost btn-square btn-sm" on:click={() => addFd.showModal()}>
				<Icon icon="material-symbols:add-circle" class="text-lg" />
			</button>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{#each data.investments.filter((i) => i.type === 'fd') ?? [] as fd (fd.name)}
				<div class="bg-white border rounded shadow-sm p-4 flex flex-col">
					<div class="flex justify-between items-center mb-2">
						<span class="font-semibold">{fd.name}</span>
						<span class="font-bold text-green-600">₹{fd.amount + (fd.amount*7*fd.quantity)/100}</span>
					</div>
					<div class="text-sm text-gray-500">
						<p>Amount: ₹{fd.amount}</p>
						<p>Years: {fd.quantity}</p>
					</div>

					<form
						class="tooltip tooltip-left ml-auto"
						data-tip="Remove this FD"
						action="?/delete"
						method="post"
						use:enhance
					>
						<input type="hidden" value={fd.id} name="id" />
						<button class="btn btn-ghost btn-square btn-sm" type="submit">
							<Icon icon="material-symbols:delete-outline-rounded" class="text-lg" />
						</button>
					</form>
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
			<h3 class="font-bold text-lg">Add Stock</h3>

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

<!--add mutual modal-->
<dialog id="addMutual" class="modal">
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
			<h3 class="font-bold text-lg">Add Mutual Fund</h3>

			<input class="hidden" name="type" value="mf" />

			<label class="form-control">
				<span class="label-text">Mutual:</span>
				<!-- <select class="select select-bordered" name="name" required>
					<option disabled selected>Select Mutual</option>
					{#each data.allStocks ?? [] as e}
						<option value={e.symbol}>{e.companyName}</option>
					{/each}
				</select> -->
				<input
					type="string"
					class="input input-bordered"
					name="name"
					placeholder="Type here"
					required
				/>
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

<!--add FD modal-->
<dialog id="addFd" class="modal">
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
			<h3 class="font-bold text-lg">Add Mutual Fund</h3>

			<input class="hidden" name="type" value="fd" />

			<label class="form-control">
				<span class="label-text">FD Name:</span>
				<!-- <select class="select select-bordered" name="name" required>
					<option disabled selected>Select Fixed Deposit</option>
					{#each data.allStocks ?? [] as e}
						<option value={e.symbol}>{e.companyName}</option>
					{/each}
				</select> -->
				<input
					type="string"
					class="input input-bordered"
					name="name"
					placeholder="Type here"
					required
				/>
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
				<span class="label-text"> Years:</span>
				<input type="text" class="input input-bordered" placeholder="Type here" name="quantity" />
			</label>
			<button class="btn btn-primary" type="submit">Save</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
