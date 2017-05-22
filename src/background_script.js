/* global fetch, chrome */
var browser = browser || chrome;

const MAINSERVER = 'https://crunchy.rubbix.net/';
const BACKUPSERVER = 'https://cr.onestay.moe/getid/';

/**
 * Main function fetching and setting the US based cookies
 * @param {String} extension extension of domain
 */
function localizeToUs(extension) {
	console.log('Setting cookie...');
	console.log('Trying to fetch main server...');
	fetchServer(MAINSERVER)
		.then(sessionId => updateCookies(extension, sessionId))
		.catch((e) => {
			console.log(`Got error ${e}. Trying backup server...`);
			fetchServer(BACKUPSERVER)
				.then(sessionId => updateCookies(extension, sessionId))
				.catch((_e) => {
					notifyUser(`Main server and backup server couldn't get a session id`);
					console.log(_e);
				});
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
			.then((res) => res.json())
			.then((res) => {
				if (!res.ok) {
					reject(new Error(res.error));
				} else {
					resolve(res.sessionId);
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
	console.log('got session id. Setting cookie.');
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
		}, postSetCookie);
	});
}

/**
 * Function called after the cookies are set
 * Reload the current tab to take the changes into account
 */
function postSetCookie() {
	console.log('Done!');
	if (typeof browser.tabs.reload === 'function') {
		console.log('reload tab using API');
		browser.tabs.reload();
	} else {
		browser.tabs.query({
			currentWindow: true,
			active: true
		}, tabs => {
			tabs.forEach(tab => {
				console.log('reload tab via content script');
				browser.tabs.sendMessage(tab.id, { msg: 'reload' });
			});
		});
	}
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
 * Open a new CR tab when the button is pressed
 */
browser.browserAction.onClicked.addListener(() => {
	browser.tabs.create({ url: 'http://crunchyroll.com/videos/anime/' });
});

/**
 *  Set a cookie with the extension transmitted from the content script
 */
browser.runtime.onMessage.addListener((message) => {
	localizeToUs(message.msg);
});
