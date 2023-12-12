<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fly, slide } from 'svelte/transition';
	import { banks, merchants, tags, transactions } from '../store';

	let newAmount: number | undefined;
	let search = '';
	let showDetailsId = 0;
	let filterTransactionType: 'income' | 'expense' | 'all' = 'all';

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

	{#if $transactions.filter((t) => t.checked).length > 0}
		<div
			class="bg-base-100 flex items-center gap-2 p-2 rounded border border-base-content/20"
			transition:slide
		>
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-sm">Tag all</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each tags as t}
						<li>
							<button
								on:click={() => {
									$transactions = $transactions.map((tr) => {
										if (tr.checked) {
											tr.tag = t;
											tr.checked = false;
										}
										return tr;
									});
								}}
							>
								{t}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-sm">Edit Merchant/Payee/Payer</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each merchants as m}
						<li>
							<button
								on:click={() => {
									$transactions = $transactions.map((tr) => {
										if (tr.checked) {
											tr.merchant = m;
											tr.checked = false;
										}
										return tr;
									});
								}}
							>
								{m}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<button
				class="btn btn-sm hover:btn-error"
				on:click={() => {
					$transactions = $transactions.map((t) => {
						t.checked = false;
						return t;
					});
				}}
			>
				Deselect All
			</button>

			<ul class="flex gap-2 text-sm font-light m-2 ml-auto">
				<div class="badge badge-neutral">
					{$transactions.filter((t) => t.checked).length} selected
				</div>

				<li>
					+ {$transactions
						.filter((t) => t.checked && t.type === 'income')
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString(undefined, {
							style: 'currency',
							currency: 'INR'
						})}
				</li>
				<li>
					- {$transactions
						.filter((t) => t.checked && t.type === 'expense')
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString(undefined, {
							style: 'currency',
							currency: 'INR'
						})}
				</li>
			</ul>
		</div>
	{/if}

	<div class="flex gap-2 w-full">
		<div
			class="bg-base-100 flex flex-col w-full border border-base-content/20 rounded overflow-x-auto transition"
		>
			<div class="bg-base-200 border border-base-content/20 flex flex-col gap-2 rounded m-2 p-1">
				<input
					class="input input-bordered"
					type="text"
					placeholder="Search Transactions..."
					bind:value={search}
				/>

				<div class="bg-base-100 tabs tabs-boxed mr-auto border border-base-content/20">
					<button
						class="tab"
						class:tab-active={filterTransactionType === 'all'}
						on:click={() => (filterTransactionType = 'all')}
					>
						All
					</button>
					<button
						class="tab"
						class:tab-active={filterTransactionType === 'income'}
						on:click={() => (filterTransactionType = 'income')}
					>
						Income
					</button>
					<button
						class="tab"
						class:tab-active={filterTransactionType === 'expense'}
						on:click={() => (filterTransactionType = 'expense')}
					>
						Expense
					</button>
				</div>
			</div>

			<ul class="flex gap-2 text-sm font-light m-2 ml-auto">
				<li>
					{$transactions.length} transactions
				</li>

				<li>
					+ {$transactions
						.filter((t) => t.type === 'income')
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString(undefined, {
							style: 'currency',
							currency: 'INR'
						})}
				</li>

				<li>
					- {$transactions
						.filter((t) => t.type === 'expense')
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString(undefined, {
							style: 'currency',
							currency: 'INR'
						})}
				</li>
			</ul>

			<table class="table">
				<thead class="sr-only">
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
						<tr
							class="hover"
							on:click={() => (showDetailsId = showDetailsId === t.id ? 0 : t.id)}
							class:hidden={(!t.merchant.toLowerCase().includes(search.toLowerCase()) &&
								!t.tag.toLowerCase().includes(search.toLowerCase()) &&
								!t.bank.toLowerCase().includes(search.toLowerCase()) &&
								!t.notes.toLowerCase().includes(search.toLowerCase())) ||
								(filterTransactionType !== 'all' && t.type !== filterTransactionType)}
						>
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
							<span class="label-text">Merchant/Payee/Payer</span>
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
							$transactions = $transactions.filter((tr) => tr.id !== t.id);
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
