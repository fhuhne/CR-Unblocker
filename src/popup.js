/* global chrome, window, document */
var browser = browser || chrome;

document.getElementById('open-cr').addEventListener('click', () => {
	browser.tabs.create({	url: 'http://crunchyroll.com/videos/anime/'	});
});

document.getElementById('saveLogin').addEventListener('change', (ev) => {
	browser.storage.local.set({ saveLogin: ev.target.checked });
	if (!ev.target.checked) {
		browser.storage.local.remove(['loginData', 'login']);
	}
});

browser.storage.local.get({ saveLogin: false }, (item) => {
	document.getElementById('saveLogin').checked = item.saveLogin;
});
