var browser = browser || chrome;

/**
 * Tab menu
 */
let tabLinks = document.querySelectorAll('.tabs li a');
let tabParent = document.querySelector('.tab-content');
for (let i = 0; i < tabLinks.length; i++) {
	let id = tabLinks[i].href;
	id = id.substring(id.indexOf('#') + 1);
	let tab = document.querySelector(`#${id}`);
	tabLinks[i].addEventListener('click', () => {
		for (let j = 0; j < tabLinks.length; j++) {
			tabLinks[j].parentNode.className = '';
		}
		tabLinks[i].parentNode.className = 'active';
		for (let j = 0; j < tabParent.children.length; j++) {
			tabParent.children[j].className = 'tab';
		}
		tab.className = 'tab active';
	});
}

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
 * Adds event listener for inputs that saves a settings value
 * @param {String}   id       ID of checkbox and name of setting
 * @param {Function} callback Optional callback to call with new state of setting
 */
function addSettingInput(id, callback) {
	document.getElementById(id).addEventListener('change', (ev) => {
		let settings = {};
		settings[id] = ev.target.value;
		browser.runtime.sendMessage({ action: 'saveSettings', settings: settings });
		if (typeof callback === 'function') {
			// eslint-disable-next-line callback-return
			callback(ev.target.value);
		}
	});
}

/**
 * Save states
 */
addSettingCheckbox('switchRegion');
addSettingCheckbox('socksCustom');
addSettingInput('socksHost');
addSettingInput('socksPort');
addSettingInput('socksUser');
addSettingInput('socksPass');

/**
 * Display settings in DOM
 * @param  {Object} settings Settings to display
 */
function displaySettings(settings) {
	document.getElementById('switchRegion').checked = settings.switchRegion;
	document.getElementById('socksCustom').checked = settings.socksCustom;
	document.getElementById('socksHost').value = settings.socksHost;
	document.getElementById('socksPort').value = settings.socksPort;
	document.getElementById('socksUser').value = settings.socksUser;
	document.getElementById('socksPass').value = settings.socksPass;
}

/**
 * Display settings on load
 */
browser.runtime.sendMessage({ action: 'getSettings' }, displaySettings);

/**
 * Listen for settings update messages
 */
browser.runtime.onMessage.addListener((message) => {
	if (message.event === 'settingsChanged') {
		displaySettings(message.settings);
	}
});
