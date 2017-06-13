/* global chrome, window, document */
var browser = browser || chrome;

/**
 * Open new tab on button click
 */
document.getElementById('open-cr').addEventListener('click', () => {
	browser.tabs.create({	url: 'http://crunchyroll.com/videos/anime/'	});
});

/**
 * Toggle the credential saving mechanism on checkbox toggle
 */
document.getElementById('save-login').addEventListener('change', (ev) => {
	browser.storage.local.set({	saveLogin: ev.target.checked });
	if (!ev.target.checked) {
		browser.storage.local.remove(['loginData', 'login']);
	}
});

/**
 * Display saved state of credentials saving mechanism in DOM
 */
browser.storage.local.get({ saveLogin: false }, (item) => {
	document.getElementById('save-login').checked = item.saveLogin;
});

/**
 * Delete data on button click
 */
document.getElementById('delete-data').addEventListener('click', () => {
	browser.storage.local.remove(['loginData', 'login']);
	let footer = document.getElementById('footer');
	let previousText = footer.children[0].innerText;
	footer.children[0].innerText = 'You data were deleted';
	footer.classList.add('blink');
	window.setTimeout(() => {
		footer.classList.remove('blink');
		footer.children[0].innerText = previousText;
	}, 3000);
});
