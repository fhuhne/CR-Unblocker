/* global chrome, window, document */
var browser = browser || chrome;
const originalText = document.getElementById('footer').children[0].innerText;

/**
 * Notify user with a message in the footer of the popup
 * @param  {String} [message=''] Message to notify the user
 */
function notifyInPopup(message = '') {
	let footer = document.getElementById('footer');
	footer.children[0].innerText = message;
	footer.classList.add('blink');
	window.setTimeout(() => {
		footer.classList.remove('blink');
		footer.children[0].innerText = originalText;
	}, 3000);
}

/**
 * Open new tab on button click
 */
document.getElementById('open-cr').addEventListener('click', () => {
	browser.tabs.create({ url: 'http://crunchyroll.com/videos/anime/' });
});

/**
 * Toggle the credential saving mechanism on checkbox toggle
 */
document.getElementById('save-login').addEventListener('change', (ev) => {
	browser.storage.local.set({ saveLogin: ev.target.checked });
	if (!ev.target.checked) {
		browser.storage.local.remove(['loginData', 'login', 'user']);
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
	browser.storage.local.remove(['loginData', 'login', 'user']);
	notifyInPopup('Your data was deleted');
});
