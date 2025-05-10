<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { merchants, tags } from '../store';
	import ImportModal from './ImportModal.svelte';

	export let form;
	export let data;

	let selectedTrIds: number[] = [];
	let showDetailsId = 0;
	let search = '';

	const filterTransactionType = queryParam('filterTransactionType', ssp.string('all')); // 'income' | 'expense' | 'all'
	const sortBy = queryParam('sortBy', ssp.string('desc')); // 'asc' | 'desc'

	$: if (form?.message) toast(form.message);

	onMount(() => {
		if (!data.banks.length) {
			toast('Please add a bank first');
			goto('/banks');
		}
	});
</script>

<div class="flex flex-col gap-2 py-4">
	<div class="flex gap-4 justify-between">
		<form class="flex self-center" action="?/add" method="post" use:enhance>
			<input
				class="input input-bordered rounded-r-none"
				type="number"
				step="0.01"
				placeholder="Enter Amount"
				name="amount"
			/>
			<button class="btn btn-primary rounded-l-none" type="submit">Add</button>
		</form>

		<button
			class="btn btn-accent self-end"
			on:click={() => document.querySelector('#importModal')?.showModal()}
		>
			<Icon icon="material-symbols:upload" class="mr-2" /> Import Transactions
		</button>
	</div>

	<div class="flex gap-2 w-full">
		<div
			class="bg-base-100 flex flex-col w-full p-2 gap-2 border rounded overflow-x-auto transition"
		>
			<div class="bg-base-200 flex flex-col gap-2 p-1 border rounded">
				<input
					class="input input-bordered w-full"
					type="text"
					placeholder="Search transactions..."
					bind:value={search}
				/>

				<div class="flex gap-2 items-center">
					<select class="select select-sm select-bordered" bind:value={$sortBy}>
						{#each [{ label: 'Newest First', value: 'desc' }, { label: 'Oldest First', value: 'asc' }] as { label, value }, i}
							<option {value}>{label}</option>
						{/each}
					</select>

					<div class="join border bg-base-100">
						{#each [{ icon: 'material-symbols:arrow-circle-down-outline-rounded', type: 'income', tooltip: 'Income' }, { icon: 'material-symbols:arrow-circle-up-outline-rounded', type: 'expense', tooltip: 'Expense' }] as tab}
							<button
								class="btn btn-sm join-item tooltip btn-ghost"
								class:btn-active={$filterTransactionType === tab.type}
								data-tip={tab.tooltip}
								on:click={() =>
									($filterTransactionType = $filterTransactionType === tab.type ? 'all' : tab.type)}
							>
								<Icon icon={tab.icon} class="text-xl" />
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="flex gap-2 p-1 text-sm font-light ml-auto">
				<span>{data.transactions.length} transactions</span>
				<span>
					+ {data.transactions
						.filter((t) => t.amount > 0)
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString('en-IN', {
							style: 'currency',
							currency: 'INR',
							signDisplay: 'never'
						})}
				</span>
				<span>
					- {data.transactions
						.filter((t) => t.amount < 0)
						.reduce((a, b) => a + b.amount, 0)
						.toLocaleString('en-IN', {
							style: 'currency',
							currency: 'INR',
							signDisplay: 'never'
						})}
				</span>
			</div>

			<table class="table rounded">
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
					{#each data.transactions as t (t.id)}
						<tr
							class="hover rounded"
							on:click={() => {
								if (selectedTrIds.length)
									selectedTrIds = selectedTrIds.includes(t.id)
										? selectedTrIds.filter((i) => i !== t.id)
										: [...selectedTrIds, t.id];
								else showDetailsId = showDetailsId === t.id ? 0 : t.id;
							}}
							class:hidden={!t.merchant?.toLowerCase().includes(search.toLowerCase()) &&
								!t.tag?.toLowerCase().includes(search.toLowerCase()) &&
								!data.banks
									.find((b) => b.id === t.bankId)
									?.name.toLowerCase()
									.includes(search.toLowerCase()) &&
								!t.notes?.toLowerCase().includes(search.toLowerCase())}
							class:bg-base-200={showDetailsId === t.id}
							animate:flip={{ duration: 200 }}
						>
							<td>
								<input
									type="checkbox"
									class="checkbox"
									bind:group={selectedTrIds}
									value={t.id}
									on:click|stopPropagation
								/>
							</td>
							<td>
								<p>
									{t.createdAt.toLocaleString('default', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</p>
								<p class="text-sm font-light whitespace-nowrap">
									{t.createdAt.toLocaleString('default', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true
									})}
								</p>
							</td>
							<td class="whitespace-nowrap text-lg font-semibold">
								{t.amount > 0 ? '+' : '-'}
								{t.amount.toLocaleString('en-IN', {
									style: 'currency',
									currency: 'INR',
									signDisplay: 'never'
								})}
							</td>
							<td>
								<select class="select" value={t.merchant} on:click|stopPropagation>
									{#each merchants as merchant}
										<option>{merchant}</option>
									{/each}
								</select>
							</td>
							<td>
								<div class="badge badge-ghost">{t.tag}</div>
							</td>
							<td>
								<img
									class="w-8 h-8"
									src="/bank-logos/{data.banks.find((b) => b.id === t.bankId)?.name}.png"
									alt=""
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Bulk Actions -->
		{#if selectedTrIds.length}
			<div
				class="bg-base-100 flex flex-col gap-2 w-96 p-4 border rounded sticky top-[52px] h-max"
				in:fly={{ y: 32 }}
			>
				<span class="badge badge-neutral badge-lg mx-auto">{selectedTrIds.length} selected</span>
				<div class="flex gap-2 text-sm font-light mx-auto">
					<span>
						+ {data.transactions
							.filter((t) => selectedTrIds.includes(t.id) && t.amount > 0)
							.reduce((a, b) => a + b.amount, 0)
							.toLocaleString('en-IN', {
								style: 'currency',
								currency: 'INR',
								signDisplay: 'never'
							})}
					</span>
					<span>
						- {data.transactions
							.filter((t) => selectedTrIds.includes(t.id) && t.amount < 0)
							.reduce((a, b) => a + b.amount, 0)
							.toLocaleString('en-IN', {
								style: 'currency',
								currency: 'INR',
								signDisplay: 'never'
							})}
					</span>
				</div>

				<div class="dropdown w-full">
					<div tabindex="0" role="button" class="btn btn-sm w-full justify-start">
						<Icon icon="material-symbols:new-label-outline-rounded" />
						Tag All
					</div>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						{#each tags as t}
							<li>
								<button
									on:click={() => {
										data.transactions = data.transactions.map((tr) => {
											if (selectedTrIds.includes(tr.id)) tr.tag = t;
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
				<button class="btn btn-sm -mt-2 justify-start">
					<Icon icon="material-symbols:label-off-outline-rounded" />
					Remove Tag
				</button>

				<div class="dropdown w-full">
					<div tabindex="0" role="button" class="btn btn-sm w-full justify-start">
						<Icon icon="material-symbols:enterprise-outline" />
						Edit Merchant
					</div>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						{#each merchants as m}
							<li>
								<button
									on:click={() => {
										data.transactions = data.transactions.map((tr) => {
											if (selectedTrIds.includes(tr.id)) tr.merchant = m;
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
				<button class="btn btn-sm -mt-2 justify-start">
					<Icon icon="material-symbols:enterprise-off-outline" />
					Remove Merchant
				</button>

				<button
					class="btn btn-sm hover:btn-error justify-start"
					on:click={() => (selectedTrIds = [])}
				>
					<Icon icon="material-symbols:block" />
					Deselect All
				</button>
			</div>
		{:else}
			{#each data.transactions.filter((t) => t.id === showDetailsId) as t}
				{#key showDetailsId}
					<form
						class="bg-base-100 flex flex-col gap-2 w-96 p-4 border rounded sticky top-[52px] h-max"
						action="?/update"
						method="post"
						use:enhance
						in:fly={{ y: 32 }}
					>
						<input type="hidden" name="id" value={t.id} />

						<div class="flex items-center justify-between gap-2">
							<p class="font-semibold text-2xl">
								{t.amount > 0 ? '+' : '-'}
								{t.amount.toLocaleString('en-IN', {
									style: 'currency',
									currency: 'INR',
									signDisplay: 'never'
								})}
							</p>

							<button class="btn btn-sm btn-square" on:click={() => (showDetailsId = 0)}>
								<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
							</button>
						</div>

						<label class="form-control">
							<div class="label"><span class="label-text">Tags</span></div>
							<select class="select select-bordered" name="tag" value={t.tag}>
								{#each tags as tag}
									<option>{tag}</option>
								{/each}
							</select>
						</label>

						<label class="form-control">
							<div class="label"><span class="label-text">Bank</span></div>
							<select class="select select-bordered" name="bankId" value={t.bankId}>
								{#each data.banks as bank}
									<option value={bank.id}>{bank.name}</option>
								{/each}
							</select>
						</label>

						<label class="form-control">
							<div class="label"><span class="label-text">Merchant/Payee/Payer</span></div>
							<select class="select select-bordered" name="merchant" value={t.merchant}>
								{#each merchants as merchant}
									<option>{merchant}</option>
								{/each}
							</select>
						</label>

						<label class="form-control">
							<div class="label"><span class="label-text">Notes</span></div>
							<textarea
								class="textarea textarea-bordered w-full"
								placeholder="Notes"
								name="notes"
								value={t.notes}
							/>
						</label>

						<div class="flex gap-2">
							<button class="btn btn-primary grow" type="submit">Update</button>
							<button class="btn btn-square btn-error" formaction="?/delete">
								<Icon icon="material-symbols:delete-outline-rounded" />
							</button>
						</div>
					</form>
				{/key}
			{/each}
		{/if}
	</div>
</div>

<ImportModal banks={data.banks} />
