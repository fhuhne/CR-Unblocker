/* global chrome, window, document */
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
 * Toggle the credential saving mechanism on checkbox toggle
 */
document.getElementById('save-login').addEventListener('change', (ev) => {
	browser.runtime.sendMessage({ action: 'saveSettings', settings: { saveLogin: ev.target.checked } });
	if (!ev.target.checked) {
		browser.storage.local.remove(['loginData', 'login', 'user']);
	}
});

/**
 * Display settings in DOM
 * @param  {Object} settings Settings to display
 */
function displaySettings(settings) {
	document.getElementById('save-login').checked = settings.saveLogin;
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

/**
 * Delete data on button click
 */
document.getElementById('delete-data').addEventListener('click', () => {
	browser.storage.local.remove(['loginData', 'login', 'user']);
});
