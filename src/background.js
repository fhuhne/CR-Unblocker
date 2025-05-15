var browser = browser || chrome;

browser.proxy.onRequest.addListener(handleProxyRequest,
	{ urls: ['*://*.crunchyroll.com/auth/v1/token', '*://cr-unblocker.us.to/'] }
);


const defaultProxyConfig = {
	type: 'socks',
	proxyDNS: true,
	host: 'cr-unblocker.us.to',
	port: 1080,
	username: 'crunblocker',
	password: 'crunblocker',
	failoverTimeout: 3
}

function handleProxyRequest(requestInfo) {
	const settings = this.settings.get();

	if (!settings.switchRegion) {
		console.log('Region switching disabled');
		return [{ type: 'direct' }];
	}

	let proxyConfig = defaultProxyConfig
	if (settings.proxyCustom) {
		proxyConfig = {
			type: settings.proxyType,
			proxyDNS: settings.proxyType !== 'http',
			host: settings.proxyHost,
			port: settings.proxyPort,
			username: settings.proxyUser || '',
			password: settings.proxyPass || '',
			failoverTimeout: 3

		}
	}
	if (proxyTestInProgress) {
		console.log(`Test ${proxyConfig.type} proxy for ${requestInfo.url} -> ${proxyConfig.host}:${proxyConfig.port}`);
	} else {
		console.log(`Using ${proxyConfig.type} proxy for ${requestInfo.url} -> ${proxyConfig.host}:${proxyConfig.port}`);
	}
	return [proxyConfig];
}

// Log any errors from the proxy script
let proxyTestInProgress = false;
let proxyTestError = null;

browser.proxy.onError.addListener(error => {
	console.error(`Proxy error: ${error.message}`);
	if (proxyTestInProgress) {
		proxyTestError = error.message;
	} else {
		browser.notifications.create('proxy-error', {
			type: 'basic',
			iconUrl: browser.runtime.getURL('icons/Crunchyroll-128.png'),
			title: 'CR-Unblocker encountered an error!',
			message: error.message
		});
	}
});

function fetchWithTimeout(url, options = {}, timeout = 5000) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);

	options.signal = controller.signal;

	return fetch(url, options)
		.finally(() => clearTimeout(timer));
}

browser.runtime.onMessage.addListener((message, sender) => {
	if (message.action === 'testProxy') {
		proxyTestInProgress = true;
		proxyTestError = null;

		return fetchWithTimeout('https://cr-unblocker.us.to', { method: 'GET', cache: 'no-store' })
			.then(res => {
				proxyTestInProgress = false;
				if (proxyTestError) {
					browser.runtime.sendMessage({
						event: 'proxyTestResult',
						success: false,
						error: proxyTestError
					});
					return { success: false, error: proxyTestError };
				} else if (res.ok) {
					browser.runtime.sendMessage({ event: 'proxyTestResult', success: true });
					return { success: true };
				} else {
					browser.runtime.sendMessage({
						event: 'proxyTestResult',
						success: false,
						error: `HTTP error: ${res.status}`
					});
					return { success: false, error: `HTTP error: ${res.status}` };
				}
			})
			.catch(err => {
				proxyTestInProgress = false;

				if (proxyTestError) {
					browser.runtime.sendMessage({
						event: 'proxyTestResult',
						success: false,
						error: proxyTestError
					});
					return { success: false, error: proxyTestError };
				}

				let userError = err.name === 'AbortError'
					? 'Connection timed out (proxy did not respond within 5 seconds)'
					: err.message;
				browser.runtime.sendMessage({
					event: 'proxyTestResult',
					success: false,
					error: userError
				});
				return { success: false, error: userError };
			});
	}
});
