const browser = window.browser || window.chrome

const DEFAULT_PROXY_CONFIG = {
	type: 'socks',
	proxyDNS: true,
	host: 'cr-unblocker.us.to',
	port: 1080,
	username: 'crunblocker',
	password: 'crunblocker',
	failoverTimeout: 3
}

let proxyTestInProgress = false
let proxyTestError = null

async function getProxyConfig(settings) {
	if (settings.proxyCustom) {
		return {
			type: settings.proxyType,
			proxyDNS: settings.proxyType !== 'http',
			host: settings.proxyHost,
			port: settings.proxyPort,
			username: settings.proxyUser || '',
			password: settings.proxyPass || '',
			failoverTimeout: 3
		}
	}
	return { ...DEFAULT_PROXY_CONFIG }
}

async function handleProxyRequest(requestInfo) {
	const settings = this.settings.get()

	if (!settings.switchRegion) {
		console.log('Region switching disabled')
		return
	}

	const proxyConfig = await getProxyConfig(settings)
	console.log(`Using ${proxyConfig.type} proxy for ${requestInfo.url} -> ${proxyConfig.host}:${proxyConfig.port}`)
	return [proxyConfig, { type: 'direct' }]
}

browser.proxy.onRequest.addListener(
	handleProxyRequest,
	{ urls: ['*://*.crunchyroll.com/auth/v1/token'] }
)
browser.webRequest.onAuthRequired.addListener(
	() => {
		const settings = this.settings.get();
		console.log(`Using ${settings.proxyType} proxy for authentication`)
		if (settings.proxyType !== 'http' && settings.proxyType !== 'https') {
			return {};
		}
		console.log(`Auth as ${settings.proxyUser} with password ${settings.proxyPass}`)
		return {
			authCredentials: {
				username: settings.proxyUser || '',
				password: settings.proxyPass || ''
			}
		};
	},
	{ urls: ['*://*.crunchyroll.com/auth/v1/token', '*://*.crunchyroll.com/'] },
	['blocking']
);

browser.proxy.onError.addListener(error => {
	console.error(`Proxy error: ${error.message}`)
	if (proxyTestInProgress) {
		proxyTestError = error.message
	} else {
		browser.notifications.create('proxy-error', {
			type: 'basic',
			iconUrl: browser.runtime.getURL('icons/Crunchyroll-128.png'),
			title: 'CR-Unblocker encountered an error!',
			message: error.message
		})
	}
})

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), timeout)
	options.signal = controller.signal

	try {
		return await fetch(url, options)
	} finally {
		clearTimeout(timer)
	}
}

async function testProxyConfig(proxy, sendResult) {
	proxyTestInProgress = true
	proxyTestError = null

	function testProxyHandler(requestInfo) {
		console.log(`Testing ${proxy.type} proxy for ${requestInfo.url} -> ${proxy.host}:${proxy.port}`)

		return {
			type: proxy.type,
			host: proxy.host,
			port: parseInt(proxy.port, 10),
			username: proxy.username,
			password: proxy.password,
			proxyDNS: proxy.type !== 'http',
			failoverTimeout: 3
		}
	}

	browser.proxy.onRequest.addListener(
		testProxyHandler,
		{ urls: ['*://*.crunchyroll.com/'] }
	)

	try {
		const res = await fetchWithTimeout('https://www.crunchyroll.com', { method: 'GET', cache: 'no-store' }, 5000)
		let result
		if (proxyTestError) {
			result = { success: false, error: proxyTestError }
		} else if (res.ok) {
			result = { success: true }
		} else {
			result = { success: false, error: `HTTP error: ${res.status}` }
		}
		sendResult({ ...result, proxy: `${proxy.host}:${proxy.port}` })
	} catch (err) {
		const userError = proxyTestError
      || (err.name === 'AbortError' ? 'Connection timed out (proxy did not respond within 5 seconds)' : err.message)
		sendResult({ success: false, error: userError, proxy: `${proxy.host}:${proxy.port}` })
	} finally {
		proxyTestInProgress = false
		browser.proxy.onRequest.removeListener(testProxyHandler)
	}
}

browser.runtime.onMessage.addListener(async(message) => {
	if (message.action === 'testCustomProxy') {
		await testProxyConfig(message.proxy, result => {
			browser.runtime.sendMessage({ event: 'customProxyTestResult', ...result })
		})
		return true
	}

	if (message.action === 'testCurrentProxy') {
		const currentSettings = this.settings.get()
		const proxyConfig = await getProxyConfig(currentSettings)
		await testProxyConfig(proxyConfig, result => {
			browser.runtime.sendMessage({ event: 'proxyTestResult', ...result })
		})

		return true
	}
})
