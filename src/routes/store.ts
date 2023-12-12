import { persisted } from 'svelte-persisted-store';

export const transactions = persisted('transactions', [
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

export const banks = ['SBI', 'HDFC', 'ICICI'];
export const merchants = [
	'Amazon',
	'Flipkart',
	'Swiggy',
	'Zomato',
	'BigBasket',
	'EaseMyTrip',
	'PayTM',
	'PhonePe',
	'Electricity Bill',
	'Water Bill',
	'Gas Bill',
	'Others'
];

export const tags = ['Salary', 'Food', 'Shopping', 'Travel', 'Bills', 'Others'];
