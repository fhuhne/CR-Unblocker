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
 * Open dashboard on button click
 */
document.getElementById('open-dashboard').addEventListener('click', () => {
	browser.tabs.create({ url: browser.extension.getURL('dashboard.html') });
});


/**
 * Adds event listener for checkbox that saves a settings value
 * @param {String}   id       ID of checkbox and name of setting
 * @param {Function} callback Optional callback to call with new state of setting
 */
function addSettingCheckbox(id, callback) {
	document.getElementById(id).addEventListener('change', (ev) => {
		let settings = {};
		settings[id] = ev.target.checked;
		browser.runtime.sendMessage({ action: 'saveSettings', settings: settings });
		if (typeof callback === 'function') {
			// eslint-disable-next-line callback-return
			callback(ev.target.checked);
		}
	});
}

/**
 * Save checkbox states
 */
addSettingCheckbox('switchRegion');

/**
 * Display settings in DOM
 */
browser.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
	document.getElementById('switchRegion').checked = settings.switchRegion;
});
