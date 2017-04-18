/* global fetch, chrome */

var browser = browser || chrome;

const mainServer = 'https://cr.onestay.moe/getid';
const backupServer = 'https://crunchy.rubbix.net/';

function setUsCookie(tld) {
	console.log('Setting cookie...');
	console.log('Trying to fetch main server...');

	fetchServer(tld, mainServer)
	.then(sessId => setCookie(sessId, tld))
	.catch((e) => {
		console.log(`Got error ${e}. Trying backup server...`);
		fetchServer(tld, backupServer)
		.then(sessId => setCookie(sessId, tld))
		.catch((_e) => {
			createError(`Main server and backup server couldn't get an session id`);
			console.log(_e);
		});
	});
}

function fetchServer(tld, uri) {
	return new Promise((resolve, reject) => {
		fetch(uri)
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			if (!res.ok) {
				reject(res.error);
			}

			resolve(res.sessionId);
		})
		.catch((e) => {
			reject(e);
		});
	});
}

function setCookie(id, tld) {
	console.log('got session id. Setting cookie.');
	// deleting the cookie sess_id
	chrome.cookies.remove({ url: `http://crunchyroll${tld}/`, name: 'sess_id' });
	chrome.cookies.remove({ url: `http://crunchyroll${tld}/`, name: 'c_locale' });

	// setting the cookie and reloading the page when it's done
	chrome.cookies.set({ url: `http://.crunchyroll${tld}/`, name: 'sess_id', value: id }, () => {
		chrome.cookies.set({ url: `http://.crunchyroll${tld}/`, name: 'c_locale', value: 'enUS' }, () => {
			chrome.tabs.reload();
		});
	});
}

function createError(e) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'Crunchyroll-512.png',
		title: 'CR-Unblocker has encountered an error',
		message: e
	});
}

// when the icon in the taskbar is clicked it will open the cr site and start the function
chrome.browserAction.onClicked.addListener(() => {
	setUsCookie('.com');
	chrome.tabs.create({ url: 'http://crunchyroll.com/videos/anime/' });
});

// when it recives the message from the content script this will execute and call the function with the correct tld
chrome.runtime.onMessage.addListener((message) => {
	setUsCookie(message.msg);
});

chrome.runtime.onStartup.addListener(() => {
	setTimeout(() => { setUsCookie('.com'); }, 3000);
});

// removing this because of https://github.com/Onestay/CR-Unblocker/issues/7

