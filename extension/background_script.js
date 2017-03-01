/* global fetch, chrome */
function setUsCookie(tld) {
	console.log('Setting cookie...');
	fetch('https://cr.onestay.moe/getid')
	.then((res) => {
		// the server should return an object with a value "sessionId" which is a string containing the session id
		return res.json();
	}).then((res) => {
		if (!res.ok) {
			return createError(res.error);
		}
		// deleting the cookie sess_id
		chrome.cookies.remove({ url: `http://crunchyroll${tld}/`, name: 'sess_id' });
		// setting the cookie and reloading the page when it's done
		chrome.cookies.set({ url: `http://.crunchyroll${tld}/`, name: 'sess_id', value: res.sessionId }, () => {
			chrome.tabs.reload();
		});
	})
	.catch((e) => {
		// if the fetch fails, this should catch the error
		createError(e);
	});
}

function createError(e) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'Crunchyroll-512.png',
		title: 'CR-Unblocker has encountered an error',
		message: `Error Message: ${e}`
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

