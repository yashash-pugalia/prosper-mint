<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { banks } from '../store';

	export let data;
	export let form;

	$: if (form?.message) toast(form.message);

	let addBank: HTMLDialogElement;
	onMount(() => {
		addBank = document.getElementById('addBank') as HTMLDialogElement;
	});
</script>

<!-- uneven width of cards to be improved -->
<div class="flex flex-wrap gap-4 py-4">
	{#each data.banks as bank}
		<div class="bg-base-100 rounded border border-base-content/20 grow">
			<div class="flex gap-2 items-center border-b px-4 py-2 border-base-content/20">
				<img class="w-8 h-8" src="/bank-logos/{bank.name}.png" alt="" />
				<span class="font-semibold">
					{bank.name}
				</span>

				<!-- add confirmation modal, this will delete transcations aswell. -->
				<form
					class="tooltip tooltip-left ml-auto"
					data-tip="Remove this Bank Account"
					action="?/delete"
					method="post"
					use:enhance
				>
					<input type="hidden" value={bank.id} name="id" />
					<button class="btn btn-ghost btn-square btn-sm" type="submit">
						<Icon icon="material-symbols:delete-outline-rounded" class="text-lg" />
					</button>
				</form>
			</div>

			<div class="p-4 pt-2 flex flex-col gap-2">
				{#each [{ name: 'Account Number', value: bank.accountNo }, { name: 'IFSC Code', value: bank.ifsc }, { name: 'Swift BIC', value: bank.swift }, { name: "Holder's Name", value: 'Yashash Pugalia' }] as { name, value }}
					<div class="flex gap-2 justify-between items-center">
						<span class="uppercase text-sm">{name}:</span>
						<button
							class="btn btn-ghost btn-xs"
							on:click={() => {
								if (value !== null) {
									navigator.clipboard.writeText(value.toString());
									toast.success('Copied to clipboard');
								}
							}}
						>
							{value}
							<Icon icon="material-symbols:content-copy-outline-rounded" />
						</button>
					</div>
				{/each}

				<button
					class="btn btn-sm"
					on:click={() => {
						navigator.clipboard.writeText(
							`Bank Name: ${bank.name}\nAccount Number: ${bank.accountNo}\nIFSC Code: ${bank.ifsc}\nSwift BIC: ${bank.swift}\nHolder's Name: Yashash Pugalia`
						);
						toast.success('Copied all details to clipboard');
					}}
				>
					Copy all details
				</button>
				<button class="btn btn-outline" on:click={() => toast('Yet to be Implemented')}>
					<Icon icon="material-symbols:download" /> Download statement
				</button>
			</div>
		</div>
	{/each}
</div>

<button class="btn btn-primary" on:click={() => addBank.showModal()}> Add new Bank Account </button>

<dialog id="addBank" class="modal">
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
					addBank.close();
				};
			}}
		>
			<h3 class="font-bold text-lg">Add Bank Account</h3>

			<label class="form-control">
				<span class="label-text">Bank Name:</span>
				<select class="select select-bordered" name="name" required>
					<option disabled selected>Select Bank</option>
					{#each banks as e}
						<option>{e}</option>
					{/each}
				</select>
			</label>
			<label class="form-control">
				<span class="label-text">Account No:</span>
				<input
					type="number"
					class="input input-bordered"
					name="accountNo"
					placeholder="Type here"
					required
				/>
			</label>
			<label class="form-control">
				<span class="label-text">IFSC Code:</span>
				<input type="text" class="input input-bordered" placeholder="Type here" name="ifsc" />
			</label>
			<label class="form-control">
				<span class="label-text">SWIFT BIC:</span>
				<input type="text" class="input input-bordered" placeholder="Type here" name="swift" />
			</label>
			<button class="btn btn-primary" type="submit">Save</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
