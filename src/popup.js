var browser = browser || chrome;

/**
 * Open new tab on button click
 */
document.getElementById('open-cr').addEventListener('click', () => {
	browser.tabs.create({ url: 'http://crunchyroll.com/' });
});

/**
 * Open dashboard on button click
 */
document.getElementById('open-dashboard').addEventListener('click', () => {
	browser.tabs.create({ url: browser.runtime.getURL('dashboard.html') });
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
