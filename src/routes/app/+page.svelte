<script lang="ts">
	import Icon from '@iconify/svelte';
	import { persisted } from 'svelte-persisted-store';
	// import { toast } from 'svelte-sonner';

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
</script>

<div class="flex flex-col gap-2 pt-4">
	<div class="flex mx-auto">
		<input
			class="input input-bordered rounded-r-none"
			type="number"
			placeholder="₹ {(Math.random() * 1000).toFixed(2)}"
			bind:value={newAmount}
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
						<th>More</th>
					</tr>
				</thead>
				<tbody>
					{#each $transactions as t}
						<tr class="hover" on:click={() => (showDetailsId = showDetailsId === t.id ? 0 : t.id)}>
							<td>
								<input type="checkbox" class="checkbox" bind:checked={t.checked} />
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
								<input
									class="input"
									type="text"
									placeholder="Start typing to add..."
									bind:value={t.merchant}
								/>
							</td>
							<td>
								<div class="badge badge-ghost">{t.tag}</div>
							</td>
							<td>
								<img class="w-8 h-8" src="/bank-logos/{t.bank.toLowerCase()}.png" alt="" />
							</td>
							<td>
								<button
									class="btn btn-sm btn-square btn-ghost"
									on:click={() => (showDetailsId = showDetailsId === t.id ? 0 : t.id)}
								>
									<Icon
										icon="material-symbols:chevron-{showDetailsId === t.id
											? 'left'
											: 'right'}-rounded"
										class="text-lg"
									/>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#each $transactions as t}
			<div
				class="bg-base-100 flex flex-col gap-2 w-96 p-4 border border-base-content/20 rounded"
				class:hidden={showDetailsId !== t.id}
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
				<select class="select select-bordered">
					{#each tags as tag}
						<option>{tag}</option>
					{/each}
				</select>
				<select class="select select-bordered">
					{#each banks as bank}
						<option>{bank}</option>
					{/each}
				</select>
				<select class="select select-bordered">
					{#each merchants as merchant}
						<option>{merchant}</option>
					{/each}
				</select>
				<textarea class="textarea textarea-bordered w-full" placeholder="Notes" />
			</div>
		{/each}
	</div>
</div>
