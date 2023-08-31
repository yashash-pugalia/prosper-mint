<script lang="ts">
	import Icon from '@iconify/svelte';
	import { persisted } from 'svelte-persisted-store';
	import { fly } from 'svelte/transition';

	let newAmount: number | undefined;

	let showDetailsId = 0;

	const transactions = persisted('transactions', [
		{
			id: 1,
			checked: false,
			date: '2021-08-01T12:00:00',
			type: 'income',
			amount: 50000,
			merchant: 'Amazon',
			tag: 'Salary',
			bank: 'HDFC',
			notes: 'Salary for the month of July'
		},
		{
			id: 2,
			checked: false,
			date: '2021-08-01T12:00:00',
			type: 'expense',
			amount: 300,
			merchant: 'Swiggy',
			tag: 'Food',
			bank: 'SBI',
			notes: 'Lunch'
		}
	]);

	const tags = ['Salary', 'Food', 'Shopping', 'Travel', 'Bills', 'Others'];
	const banks = ['SBI', 'HDFC', 'ICICI'];
	const merchants = ['Amazon', 'Swiggy', 'Zomato', 'Flipkart', 'BigBasket', 'Grofers'];

	const addTransaction = () => {
		if (!newAmount) {
			// toast('Please enter an amount');
			return;
		}

		$transactions = [
			...$transactions,
			{
				id: $transactions.length + 1,
				checked: false,
				date: new Date().toISOString(),
				type: newAmount < 0 ? 'expense' : 'income',
				amount: Math.abs(newAmount),
				merchant: merchants[Math.floor(Math.random() * merchants.length)],
				tag: tags[Math.floor(Math.random() * tags.length)],
				bank: banks[Math.floor(Math.random() * banks.length)],
				notes: ''
			}
		];

		newAmount = undefined;
	};

	// onMount(() => {
	// $transactions = $transactions.sort((a, b) => (a.date > b.date ? -1 : 1));
	// });
</script>

<div class="flex flex-col gap-2 py-4">
	<div class="flex mx-auto">
		<input
			class="input input-bordered rounded-r-none"
			type="number"
			placeholder="Enter Amount"
			bind:value={newAmount}
			on:keypress={(e) => {
				if (e.key === 'Enter') addTransaction();
			}}
		/>
		<button on:click={addTransaction} class="btn btn-neutral rounded-l-none">Add</button>
	</div>

	<div class="flex gap-2 w-full">
		<div
			class="bg-base-100 w-full border border-base-content/20 rounded overflow-x-auto transition"
		>
			<table class="table">
				<!-- class="sr-only" -->
				<thead>
					<tr>
						<th>Select</th>
						<th>Date</th>
						<th>Amount</th>
						<th>Merchant/Payee/Payer</th>
						<th>Tag</th>
						<th>Bank</th>
					</tr>
				</thead>
				<tbody>
					{#each $transactions as t}
						<tr class="hover" on:click={() => (showDetailsId = showDetailsId === t.id ? 0 : t.id)}>
							<td>
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={t.checked}
									on:click|stopPropagation
								/>
							</td>
							<td>
								<p>
									{new Date(t.date).toLocaleString('default', { month: 'short', day: 'numeric' })}
								</p>
								<p class="text-sm font-light whitespace-nowrap">
									{new Date(t.date).toLocaleString('default', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true
									})}
								</p>
							</td>
							<td class="whitespace-nowrap">
								{t.type === 'income' ? '+' : '-'}
								<span class="text-lg font-semibold">
									{t.amount.toLocaleString(undefined, {
										style: 'currency',
										currency: 'INR'
									})}
								</span>
							</td>
							<td>
								<select class="select" bind:value={t.merchant} on:click|stopPropagation>
									{#each merchants as merchant}
										<option>{merchant}</option>
									{/each}
								</select>
							</td>
							<td>
								<div class="badge badge-ghost">{t.tag}</div>
							</td>
							<td>
								<img class="w-8 h-8" src="/bank-logos/{t.bank.toLowerCase()}.png" alt="" />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#each $transactions as t}
			{#if t.id === showDetailsId}
				<div
					class="bg-base-100 flex flex-col gap-2 w-96 p-4 border border-base-content/20 rounded sticky top-[52px] h-max"
					in:fly={{ y: 32 }}
				>
					<div class="flex items-center justify-between gap-2">
						<p class="font-semibold text-lg">
							{t.amount.toLocaleString(undefined, {
								style: 'currency',
								currency: 'INR'
							})}
						</p>

						<button class="btn btn-sm btn-square" on:click={() => (showDetailsId = 0)}>
							<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
						</button>
					</div>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Type</span>
						</div>
						<select class="select select-bordered" bind:value={t.type}>
							<option>income</option>
							<option>expense</option>
						</select>
					</label>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Tags</span>
						</div>

						<select class="select select-bordered" bind:value={t.tag}>
							{#each tags as tag}
								<option>{tag}</option>
							{/each}
						</select>
					</label>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Bank</span>
						</div>
						<select class="select select-bordered" bind:value={t.bank}>
							{#each banks as bank}
								<option>{bank}</option>
							{/each}
						</select>
					</label>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Merchant</span>
						</div>
						<select class="select select-bordered" bind:value={t.merchant}>
							{#each merchants as merchant}
								<option>{merchant}</option>
							{/each}
						</select>
					</label>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Notes</span>
						</div>
						<textarea
							class="textarea textarea-bordered w-full"
							placeholder="Notes"
							bind:value={t.notes}
						/>
					</label>

					<button
						class="btn btn-error"
						on:click={() => {
							$transactions = $transactions.filter((transaction) => transaction.id !== t.id);
							showDetailsId = 0;
						}}
					>
						Delete
					</button>
				</div>
			{/if}
		{/each}
	</div>
</div>
