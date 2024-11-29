// place files you want to import through the `$lib` alias in this folder.

export const amountToINR = (amount: number) => {
	return amount.toLocaleString('en-IN', {
		style: 'currency',
		currency: 'INR',
		signDisplay: 'never',
		// maximumFractionDigits: 2
	});
};
