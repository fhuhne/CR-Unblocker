/* global fetch, chrome */
var browser = browser || chrome;

const API_BASE = 'http://api-manga.crunchyroll.com/cr_start_session?device_id=a&api_ver=1.0';
const SERVERS = [
	`${API_BASE}&device_type=com.crunchyroll.manga.android&access_token=FLpcfZH4CbW4muO`,
	`${API_BASE}&device_type=com.crunchyroll.iphone&access_token=QWjz212GspMHH9h`
];

/**
 * Main function fetching and setting the US based cookies
 * @param {String} extension extension of domain
 */
function localizeToUs(extension) {
	console.log('Setting cookie...');
	console.log('Trying to fetch main server...');
	SERVERS.shuffle();
	sequentialFetch(SERVERS, extension);
}

function sequentialFetch(urls, extension) {
	fetchServer(urls[0])
		.then(sessionId => updateCookies(extension, sessionId))
		.catch(e => {
			if (urls.slice(1).length > 0) {
				sequentialFetch(urls.slice(1), extension);
			} else {
				notifyUser(`Main server and backup server couldn't get a session id`);
				console.log(e);
			}
		});
}

/**
 * Fetch a session ID from a server
 * @param  {String} uri URL of the backend server
 * @return {Promise}     A promise resolving to the the session ID (string)
 */
function fetchServer(uri) {
	return new Promise((resolve, reject) => {
		fetch(uri)
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				reject(new Error(res.status));
			})
			.then(json => {
				if (json.error === true) {
					reject(new Error(json.message));
				} else if (json.data.country_code !== 'US') {
					reject(new Error('Session id not from the US'));
				} else {
					resolve(json.data.session_id);
				}
			})
			.catch((e) => reject(e));
	});
}

/**
 * Update the cookies to the new values
 * Nested callbacks for Edge compatibility
 * @param {String} extension hostname extension
 * @param {String} sessionId  New session ID
 */
function updateCookies(extension, sessionId) {
	console.log(`got session id. Setting cookie ${sessionId}.`);
	browser.cookies.set({
		url: `http://crunchyroll${extension}`,
		name: 'sess_id',
		value: sessionId,
		domain: `crunchyroll${extension}`,
		httpOnly: true
	}, () => {
		browser.cookies.set({
			url: `http://crunchyroll${extension}`,
			name: 'c_locale',
			value: 'enUS',
			domain: `crunchyroll${extension}`,
			httpOnly: true
		}, () => doLogin(sessionId));
	});
}

/**
 * Logs in a user using the given login data
 * @param {String} sessionId current session id
 * @param {Object} loginData login data (properties username and password are needed)
 * @return {Promise} A promise resolving to the login data (contains user data, auth and expiration)
 */
function loginUser(sessionId, loginData) {
	return new Promise((resolve, reject) => {
		fetch(`https://api.crunchyroll.com/login.0.json?session_id=${sessionId}&locale=enUS&account=${encodeURIComponent(loginData.username)}&password=${encodeURIComponent(loginData.password)}`)
			.then((res) => res.json())
			.then((res) => {
				if (res.error === true) {
					reject(new Error(res.message));
				} else {
					resolve(res.data);
				}
			})
			.catch((e) => reject(e));
	});
}

/**
 * Function called after the cookies are set
 * Login user if needed
 * @param {String} sessionId current session id
 */
function doLogin(sessionId) {
	browser.storage.local.get({ saveLogin: false, loginData: {} }, (item) => {
		if (item.saveLogin && item.loginData !== {}) {
			// login data stored, log the user in
			console.log('logging user in');
			loginUser(sessionId, item.loginData)
				.then((data) => {
					console.log(`user logged in until ${data.expires}`);
					// store auth and expiration, then reload
					browser.storage.local.set({ login: { auth: data.auth, expiration: data.expires } }, reloadTab);
				})
				.catch((_e) => {
					notifyUser('Failed to login, please log in manually.');
					console.log(_e);
					reloadTab();
				});
		} else {
			// no need to login, reload immediately
			reloadTab();
		}
	});
}

/**
 * Function called after the user is logged in (if they want to)
 * Reload the current tab to take the changes into account
 */
function reloadTab() {
	console.log('Done!');
	browser.tabs.query({
		currentWindow: true,
		active: true
	}, tabs => {
		tabs.forEach(tab => {
			console.log('Reload tab via content script');
			browser.tabs.sendMessage(tab.id, {
				msg: 'reload'
			});
		});
	});
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
	});
}

/**
 *  Set a cookie with the extension transmitted from the content script
 */
browser.runtime.onMessage.addListener((message) => {
	localizeToUs(message.msg);
});

/**
 * Add a method to shuffle arrays randomly
 */
Array.prototype.shuffle = () => {
	var swapIndex, tempElement;
	for (var i = this.length; i; i--) {
		swapIndex = Math.floor(Math.random() * i);
		tempElement = this[i - 1];
		this[i - 1] = this[swapIndex];
		this[swapIndex] = tempElement;
	}
};
