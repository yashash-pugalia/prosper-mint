<script lang="ts">
	import { enhance } from '$app/forms';
	import { amountToINR } from '$lib';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;

	let addInvestment: HTMLDialogElement;
	let addMutualFund: HTMLDialogElement;
	let addFixedDeposit: HTMLDialogElement;
	onMount(() => {
		addInvestment = document.getElementById('addInvestment') as HTMLDialogElement;
		addMutualFund = document.getElementById('addMutualFund') as HTMLDialogElement;
		addFixedDeposit = document.getElementById('addFixedDeposit') as HTMLDialogElement;
	});

	const calculateTotal = (inv: typeof data.investments) =>
		amountToINR(inv.reduce((s, i) => s + i.quantity * (i.prevClose ? i.prevClose : i.amount), 0));
</script>

<div class="bg-base-200 rounded border grow flex flex-col my-8 overflow-hidden">
	<div class="flex gap-2 items-center border-b px-4 py-2 bg-base-100">
		<span class="font-semibold text-lg">Stocks</span>
		<span class="ml-auto font-bold text-success">
			{calculateTotal(data.investments.filter((i) => i.type === 'stocks'))}
		</span>

		<button class="btn btn-ghost btn-square btn-sm" on:click={() => addInvestment.showModal()}>
			<Icon icon="material-symbols:add-circle" class="text-lg" />
		</button>
	</div>

	<div class="flex gap-4 p-4 overflow-auto">
		{#each data.investments.filter((i) => i.type === 'stocks') ?? [] as stock (stock.name)}
			{@const returns = ((stock.prevClose - stock.amount) / stock.amount) * 100}

			<div class="bg-base-100 border rounded p-4 pt-2 flex flex-col gap-4 w-80 shrink-0">
				<div class="flex justify-between items-center gap-4">
					<span class="font-semibold">{stock.companyName}</span>

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
				</div>

				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Buy Price:
					<span class="ml-auto badge badge-ghost">{amountToINR(stock.amount)} </span>
				</p>

				<!-- <p class="flex gap-4 justify-between text-sm text-base-content/70">
					Last Trading Price:
					<span class="ml-auto badge badge-ghost">{amountToINR(stock.prevClose)} </span>
				</p> -->

				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Shares:
					<span class="ml-auto badge badge-ghost">{stock.quantity} </span>
				</p>

				<div class="flex gap-4 justify-between">
					<div>
						<p class="text-xs text-base-content/70">YOUR HOLDING</p>
						<p class="text-2xl font-semibold">{amountToINR(stock.quantity * stock.prevClose)}</p>
					</div>

					<div class="flex flex-col items-end">
						<p class="text-xs text-base-content/70">RETURNS</p>
						<p
							class="flex text-xl mt-auto text-nowrap {returns >= 0
								? 'text-success'
								: 'text-error'}"
						>
							<Icon
								icon="material-symbols:arrow-drop-{returns >= 0 ? 'up' : 'down'}-rounded"
								class="text-3xl"
							/>
							{Math.abs(returns).toFixed(2)}%
						</p>
					</div>
				</div>

				<img class="-hue-rotate-60 rounded" transition:slide src={stock.chart365dPath} alt="" />
			</div>
		{/each}
	</div>
</div>

<!-- Mutual Funds -->
<div class="bg-base-200 rounded border grow flex flex-col my-8 overflow-hidden">
	<div class="flex gap-2 items-center border-b px-4 py-2 bg-base-100">
		<span class="font-semibold text-lg">Mutual Funds</span>
		<span class="ml-auto font-bold text-success">
			{calculateTotal(data.investments.filter((i) => i.type === 'mf'))}
		</span>
		<button class="btn btn-ghost btn-square btn-sm" on:click={() => addMutualFund.showModal()}>
			<Icon icon="material-symbols:add-circle" class="text-lg" />
		</button>
	</div>
	<div class="flex gap-4 p-4 overflow-auto">
		{#each data.investments.filter((i) => i.type === 'mf') ?? [] as fund (fund.name)}
			{@const returns = ((fund.prevClose - fund.amount) / fund.amount) * 100}
			<div class="bg-base-100 border rounded p-4 pt-2 flex flex-col gap-4 w-80 shrink-0">
				<div class="flex justify-between items-center gap-4">
					<span class="font-semibold">{fund.name}</span>

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

				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Invested:
					<span class="ml-auto badge badge-ghost">{amountToINR(fund.amount * fund.quantity)}</span>
				</p>

				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					{returns >= 0 ? 'Gain' : 'Loss'}:
					<span class="ml-auto badge badge-ghost"
						>{amountToINR((fund.prevClose - fund.amount) * fund.quantity)}</span
					>
				</p>

				<div class="flex gap-4 justify-between">
					<div>
						<p class="text-xs text-base-content/70">CURRENT</p>
						<p class="text-2xl font-semibold">{amountToINR(fund.prevClose * fund.quantity)}</p>
					</div>

					<div class="flex flex-col items-end">
						<p class="text-xs text-base-content/70">RETURNS</p>
						<p
							class="flex text-xl mt-auto text-nowrap {returns >= 0
								? 'text-success'
								: 'text-error'}"
						>
							<Icon
								icon="material-symbols:arrow-drop-{returns >= 0 ? 'up' : 'down'}-rounded"
								class="text-3xl"
							/>
							{Math.abs(returns).toFixed(2)}%
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Fixed Deposits -->
<div class="bg-base-200 rounded border grow flex flex-col my-8 overflow-hidden">
	<div class="flex gap-2 items-center border-b px-4 py-2 bg-base-100">
		<span class="font-semibold text-lg">Fixed Deposits</span>
		<span class="ml-auto font-bold text-success">
			{amountToINR(
				data.investments
					.filter((i) => i.type === 'fd')
					.reduce((total, fd) => total + (fd.amount + (fd.amount * 7 * fd.quantity) / 100), 0)
			)}
		</span>
		<button class="btn btn-ghost btn-square btn-sm" on:click={() => addFixedDeposit.showModal()}>
			<Icon icon="material-symbols:add-circle" class="text-lg" />
		</button>
	</div>
	<div class="flex gap-4 p-4 overflow-auto">
		{#each data.investments.filter((i) => i.type === 'fd') ?? [] as fd (fd.name)}
			<div class="bg-base-100 border rounded p-4 pt-2 flex flex-col gap-4 w-80 shrink-0">
				<div class="flex justify-between items-center gap-4">
					<span class="font-semibold">{fd.name}</span>

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

				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Invested:
					<span class="ml-auto badge badge-ghost">{amountToINR(fd.amount)}</span>
				</p>
				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Total Interest:
					<span class="ml-auto badge badge-ghost">{amountToINR(fd.prevClose - fd.amount)}</span>
				</p>
				<p class="flex gap-4 justify-between text-sm text-base-content/70">
					Years:
					<span class="ml-auto badge badge-ghost">{fd.quantity}</span>
				</p>

				<div class="flex gap-4 justify-between">
					<div>
						<p class="text-xs text-base-content/70">MATURITY AMOUNT</p>
						<p class="text-2xl font-semibold">{amountToINR(fd.prevClose)}</p>
					</div>

					<div class="flex flex-col items-end">
						<p class="text-xs text-base-content/70">INTEREST RATE</p>
						<p class="flex text-xl mt-auto text-nowrap text-success">
							<Icon icon="material-symbols:arrow-drop-up-rounded" class="text-3xl" /> 7%
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<dialog id="addInvestment" class="modal">
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
					addInvestment.close();
				};
			}}
		>
			<h3 class="font-bold text-lg">Add Stock</h3>

			<input class="hidden" name="type" value="stocks" />
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
				<span class="label-text">Buy Price:</span>
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

<dialog id="addMutualFund" class="modal">
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
					addInvestment.close();
				};
			}}
		>
			<h3 class="font-bold text-lg">Add Mutual Fund</h3>

			<input class="hidden" name="type" value="mf" />
			<label class="form-control">
				<span class="label-text">Fund Name:</span>
				<input
					type="string"
					class="input input-bordered"
					name="name"
					placeholder="Type here"
					required
				/>
			</label>
			<label class="form-control">
				<span class="label-text">Amount:</span>
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

<dialog id="addFixedDeposit" class="modal">
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
					addInvestment.close();
				};
			}}
		>
			<h3 class="font-bold text-lg">Add Fixed Deposit</h3>

			<input class="hidden" name="type" value="fd" />
			<label class="form-control">
				<span class="label-text">FD Name:</span>
				<input
					type="string"
					class="input input-bordered"
					name="name"
					placeholder="Type here"
					required
				/>
			</label>
			<label class="form-control">
				<span class="label-text">Amount:</span>
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
