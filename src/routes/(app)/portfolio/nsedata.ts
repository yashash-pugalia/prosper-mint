export interface StocksResponse {
	data: {
		previousClose: number;
		symbol: string;
		chart365dPath: string;
		meta: { companyName: string };
	}[];
}

// TODO: cache the data, they will rate limit us if we grow
export const getNseData = async () => {
	const userAgent =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
	const quotesUrl = 'https://www.nseindia.com/get-quotes/equity?symbol=TCS';
	const apiUrl = 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET';

	try {
		// Step 1: Get cookies from the quotes page
		const quotesRes = await fetch(quotesUrl, {
			headers: {
				'User-Agent': userAgent,
				Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				Referer: 'https://www.nseindia.com/'
			}
			// credentials: 'include' // not needed in node fetch
		});

		const setCookie = quotesRes.headers.get('set-cookie');
		let cookie = '';
		if (setCookie) {
			// Only take the cookie part before the first semicolon for each cookie
			cookie = setCookie
				.split(',')
				.map((c) => c.split(';')[0])
				.join('; ');
		}

		// Step 2: Use cookies and user-agent to fetch the API
		const apiRes = await fetch(apiUrl, {
			headers: {
				'User-Agent': userAgent,
				Accept: 'application/json',
				Referer: 'https://www.nseindia.com/',
				Cookie: cookie
			}
		});

		if (!apiRes.ok) throw new Error('NSE API error: ' + apiRes.status);
		const res: StocksResponse = await apiRes.json();
		return res;
	} catch (error) {
		console.error(error);
		return { data: [] };
	}
};
