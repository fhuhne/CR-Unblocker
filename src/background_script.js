var browser = browser || chrome

const SERVERS = [
	{ url: 'https://cr-unblocker.us.to/start_session?version=1.1', sendUserId: true }
]

/**
 * Resets the timer, e.g. when on the login page
 */
function resetLastUnblock() {
	console.log('removing timer')
	localStorage.removeItem('last_unblock')
}

/**
 * Main function fetching and setting the US based cookies
 * @param {String} extension extension of domain
 * @param {boolean} loggedIn login status of user
 */
function localizeToUs(extension) {
	var lastUnblock = localStorage.getItem('last_unblock')

	if (lastUnblock && lastUnblock > new Date().getTime()) {
		console.log('Not fetching session id, last try less than a minute ago.')
		console.log(`Remaining: ${(lastUnblock - new Date().getTime()) / 1000} seconds`)
		return
	}

	console.log('Fetching session id.')
	SERVERS.shuffle()
	let settings = this.settings.get()
	browser.storage.local.get({ login: null, user: null }, (item) => {
		var auth = ''
		if (settings.saveLogin && item.login !== null) {
			console.log('Logging in using auth token.')
			auth = `&auth=${encodeURIComponent(item.login.auth)}`
		}
		try {
			sequentialFetch(SERVERS, extension, auth, item.user)
		} finally {
			localStorage.setItem('last_unblock', new Date(new Date().getTime() + (60 * 1000)).getTime())
		}
	});
}

/**
 * Fetch in order an array of servers URLs
 * @param  {Array} servers      Servers to fetch in order
 * @param  {String} extension Extension of the current domain
 * @param  {String} auth      Auth token to login user
 * @param  {Object} user User data for the user to log in
 */
function sequentialFetch(servers, extension, auth, user) {
	console.log(`Fetching server ${servers[0].url}`)
	fetchServer(servers[0], auth, user)
		.then(sessionData => updateCookies(extension, sessionData))
		.catch(e => {
			console.log(e);
			if (servers.slice(1).length > 0) {
				sequentialFetch(servers.slice(1), extension, auth, user)
			} else {
				notifyUser(`CR-Unblocker couldn't get a session id. Delaying retry for a minute ...`)
			}
		})
}

/**
 * Fetch a session ID from a server
 * @param  {Object} server Object describing backend server to use
 * @param  {String} auth      Auth token to login user
 * @param  {Object} user User data for the user to log in
 * @return {Promise}     A promise resolving to the the session data containing session id and possibly user/auth data
 */
function fetchServer(server, auth, user) {
	return new Promise((resolve, reject) => {
		let uri = server.url + auth
		if (server.sendUserId && user !== null && user.userId !== null && auth !== '') {
			console.log('sendUserId')
			uri += `&user_id=${encodeURIComponent(user.userId)}`
		}
		if (server.generateDeviceId) {
			uri += `&device_id=${generateDeviceId()}`
		}
		fetch(uri)
			.then(res => {
				if (res.ok) {
					return res.json()
				}
				reject(new Error(res.status))
			})
			.then(json => {
				if (json.error === true) {
					reject(new Error(json.message))
				} else if (json.data.country_code !== 'US') {
					reject(new Error('Session id not from the US'))
				} else {
					resolve(json.data)
				}
			})
			.catch((e) => reject(e))
	});
}

/**
 * Update the cookies to the new values
 * Nested callbacks for Edge compatibility
 * @param {String} extension hostname extension
 * @param {Object} sessionData  New session data
 */
function updateCookies(extension, sessionData) {
	console.log(`got session id. Setting cookie ${sessionData.session_id}.`)
	browser.cookies.set({
		url: `http://crunchyroll${extension}`,
		name: 'session_id',
		value: sessionData.session_id,
		domain: `crunchyroll${extension}`,
		httpOnly: true
	}, () => {
		browser.cookies.set({
			url: `http://crunchyroll${extension}`,
			name: 'c_locale',
			value: 'enUS',
			domain: `crunchyroll${extension}`,
			httpOnly: true
		})
	})
	reloadTab()
}

/**
 * Function called after the user is logged in (if they want to)
 * Reload the current tab to take the changes into account
 */
function reloadTab() {
	console.log('Done!')
	browser.tabs.query({
		currentWindow: true,
		active: true
	}, tabs => {
		tabs.forEach(tab => {
			console.log('Reload tab via content script')
			browser.tabs.sendMessage(tab.id, { action: 'reload' })
		})
	})
}

/**
 * Emit a notification to the user with an error message
 * @param  {String} msg Error message
 */
function notifyUser(msg) {
	browser.notifications.create({
		type: 'basic',
		iconUrl: 'icons/Crunchyroll-128.png',
		title: 'CR-Unblocker has encountered an error',
		message: msg
	})
}

/**
 *  Add content script listener
 */
browser.runtime.onMessage.addListener((message) => {
	switch (message.action) {
		case 'localizeToUs':
			localizeToUs(message.extension, message.loggedIn)
			break
		case 'resetLastUnblock':
			resetLastUnblock()
			break
	}
})

/**
 *  Open the changelog page after update or installation
 */
browser.runtime.onInstalled.addListener((detail) => {
	if (detail.reason === 'install' || detail.reason === 'update') {
		browser.tabs.create({ url: 'https://cr-unblocker.us.to' })
	}
})

/**
 * Add a method to shuffle arrays randomly
 */
Array.prototype.shuffle = function shuffle() {
	var swapIndex, tempElement
	for (var i = this.length; i; i--) {
		swapIndex = Math.floor(Math.random() * i)
		tempElement = this[i - 1]
		this[i - 1] = this[swapIndex]
		this[swapIndex] = tempElement
	}
}

/**
 * Generate a random 32 character long device ID
 * @return {String} Generated device ID
 */
function generateDeviceId() {
	let id = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < 32; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return id
}
