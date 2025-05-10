<script lang="ts">
	export let banks: { id: number; name: string }[] = [];

	let transactions: { date: string; notes: string; amount: number; bankId: number }[] = [];
	let selectedBankId: number = banks[0]?.id || 0;
	let csvError = '';
	let importStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let importMessage = '';

	const handleFileChange = async (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		const text = await file.text();
		try {
			const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
			if (lines.length < 2) {
				csvError = 'CSV must have at least one data row.';
				return;
			}
			// Find header and trim each header cell
			const header = lines[0].split(',').map((h) => h.trim());
			const idx = {
				date: header.findIndex((h) => h.toLowerCase().startsWith('date')),
				narration: header.findIndex((h) => h.toLowerCase().includes('narration')),
				debit: header.findIndex((h) => h.toLowerCase().includes('debit')),
				credit: header.findIndex((h) => h.toLowerCase().includes('credit'))
			};
			if (Object.values(idx).some((i) => i === -1)) {
				csvError = 'Missing required columns (Date, Narration, Debit Amount, Credit Amount).';
				return;
			}
			transactions = lines.slice(1).map((line) => {
				const cells = line.split(',').map((c) => c.trim());
				const date = cells[idx.date] || '';
				const notes = cells[idx.narration] || '';
				const debit = parseFloat((cells[idx.debit] || '').replace(/,/g, '')) || 0;
				const credit = parseFloat((cells[idx.credit] || '').replace(/,/g, '')) || 0;
				const amount = credit > 0 ? credit : -debit;
				return { date, notes, amount, bankId: selectedBankId };
			});
			csvError = '';
		} catch (err) {
			csvError = 'Failed to parse CSV rows.';
		}
	};

	const handleBankChange = (e: Event) => {
		selectedBankId = Number((e.target as HTMLSelectElement).value);
		transactions = transactions.map((t) => ({ ...t, bankId: selectedBankId }));
	};

	async function importTransactions() {
		if (!transactions.length) return;
		importStatus = 'loading';
		importMessage = '';
		try {
			const formData = new FormData();
			formData.append('transactions', JSON.stringify(transactions));
			const res = await fetch('?/import', {
				method: 'POST',
				body: formData
			});
			const data = await res.json();
			if (res.ok) {
				importStatus = 'success';
				importMessage = data.message || 'Imported successfully!';
				transactions = [];
			} else {
				importStatus = 'error';
				importMessage = data.message || 'Import failed.';
			}
		} catch (e) {
			importStatus = 'error';
			importMessage = 'Import failed.';
		}
	}
</script>

<dialog id="importModal" class="modal">
	<div class="modal-box max-w-2xl">
		<h2 class="font-bold text-lg mb-2">Bulk Import Bank Transactions</h2>
		<div class="alert mb-4">
			<strong>Note:</strong> Currently only HDFC Bank statement is supported (comma-delimited CSV).
		</div>

		<input
			type="file"
			class="file-input file-input-bordered w-full max-w-xs"
			accept=".csv,.txt"
			on:change={handleFileChange}
		/>
		{#if banks.length > 0}
			<label class="block mt-2"
				>Select Bank:
				<select
					class="select select-bordered ml-2"
					bind:value={selectedBankId}
					on:change={handleBankChange}
				>
					{#each banks as bank}
						<option value={bank.id}>{bank.name}</option>
					{/each}
				</select>
			</label>
		{/if}
		{#if csvError}
			<div class="text-red-500">{csvError}</div>
		{/if}
		{#if transactions.length > 0}
			<div class="overflow-x-auto mt-4 max-h-64">
				<table class="table table-zebra w-full text-xs">
					<thead>
						<tr>
							<th>Date</th>
							<th>Notes</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each transactions as t}
							<tr>
								<td>{t.date}</td>
								<td>{t.notes}</td>
								<td>{t.amount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<button
				class="btn btn-primary w-fit self-end mt-2"
				on:click={importTransactions}
				disabled={importStatus === 'loading'}
			>
				{importStatus === 'loading' ? 'Importing...' : `Import ${transactions.length} Transactions`}
			</button>
		{/if}
		{#if importStatus === 'success'}
			<div class="text-green-600 mt-2">{importMessage}</div>
		{:else if importStatus === 'error'}
			<div class="text-red-600 mt-2">{importMessage}</div>
		{/if}
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</div>
</dialog>
