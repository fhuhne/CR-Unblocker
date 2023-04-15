var browser = browser || chrome

browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ['*://*.crunchyroll.com/auth/v1/token'] });

function handleProxyRequest(requestInfo) {
	let settings = this.settings.get()

	if (!settings.switchRegion) {
		console.log('Region switching disabled')
		return
	}

	if (!settings.socksCustom) {
		settings.socksHost = 'cr-unblocker.us.to'
		settings.socksPort = 1080
		settings.socksUser = 'crunblocker'
		settings.socksPass = 'crunblocker'
	}

	console.log('Proxied request %s to %s %d', requestInfo.url, settings.socksHost, settings.socksPort);
	return [
		{ type: 'socks', proxyDNS: true, failoverTimeout: 3, host: settings.socksHost, port: settings.socksPort, username: settings.socksUser, password: settings.socksPass },
		{ type: 'direct' }
	]
}

// Log any errors from the proxy script
browser.proxy.onError.addListener(error => {
	console.error(`Proxy error: ${error.message}`);
	browser.notifications.create('proxy-error', {
		type: 'basic',
		iconUrl: browser.runtime.getURL('icons/Crunchyroll-128.png'),
		title: 'CR-Unblocker encountered an error!',
		message: error.message
	});
});
