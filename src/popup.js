/* global chrome, window, document */
var browser = browser || chrome;

document.getElementById('open-cr').addEventListener('click', () => {
	browser.tabs.create({	url: 'http://crunchyroll.com/videos/anime/'	});
});
