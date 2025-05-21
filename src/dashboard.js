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
addSettingCheckbox('switchRegion')
addSettingCheckbox('proxyCustom')
addSettingInput('proxyType')
addSettingInput('proxyHost')
addSettingInput('proxyPort')
addSettingInput('proxyUser')
addSettingInput('proxyPass')

/**
 * Display settings in DOM
 * @param  {Object} settings Settings to display
 */
function displaySettings(settings) {
	document.getElementById('switchRegion').checked = settings.switchRegion
	document.getElementById('proxyCustom').checked = settings.proxyCustom
	document.getElementById('proxyType').value = settings.proxyType || 'socks'
	document.getElementById('proxyHost').value = settings.proxyHost
	document.getElementById('proxyPort').value = settings.proxyPort
	document.getElementById('proxyUser').value = settings.proxyUser
	document.getElementById('proxyPass').value = settings.proxyPass
}

/**
 * Display settings on load
 */
browser.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
	displaySettings(settings)
	handleSwitchRegionChange(settings.switchRegion)
});

/**
 * Listen for settings update messages
 */
browser.runtime.onMessage.addListener((message) => {
	if (message.event === 'settingsChanged') {
		displaySettings(message.settings);
		handleSwitchRegionChange(message.settings.switchRegion);
	}
});

/**
 * Test for the proxy configuration
 */
document.getElementById('testProxyBtn').addEventListener('click', () => {
	const proxyType = document.getElementById('proxyType').value;
	const proxyHost = document.getElementById('proxyHost').value;
	const proxyPort = parseInt(document.getElementById('proxyPort').value, 10);
	const proxyUser = document.getElementById('proxyUser').value;
	const proxyPass = document.getElementById('proxyPass').value;

	document.getElementById('proxyTestResult').textContent = 'Testing proxy...';

	browser.runtime.sendMessage({
		action: 'testCustomProxy',
		proxy: {
			type: proxyType,
			host: proxyHost,
			port: proxyPort,
			username: proxyUser,
			password: proxyPass
		}
	});
});

// Listen for the result
browser.runtime.onMessage.addListener((message) => {
	if (message.event === 'customProxyTestResult') {
		const output = document.getElementById('proxyTestResult');
		output.style.fontWeight = 'bold';
		output.style.padding = '8px 0';
		output.style.borderRadius = '4px';

		if (message.success) {
			output.textContent = `✅ Proxy[${message.proxy}] is working!`;
			output.style.color = '#f78c25';
			output.style.backgroundColor = 'white';
		} else {
			output.textContent = `❌ Proxy[${message.proxy}] failed: ${message.error}`;
			output.style.color = 'white';
			output.style.backgroundColor = '#dc7c20';
		}
	}

	if (message.event === 'proxyTestResult') {
		const output = document.getElementById('proxyStatus');

		if (message.success) {
			output.textContent = `✅ Proxy[${message.proxy}] is working!`;
			output.style.color = '#f78c25';
			output.style.backgroundColor = 'white';
		} else {
			output.textContent = `❌ Proxy[${message.proxy}] failed: ${message.error}`;
			output.style.color = 'white';
			output.style.backgroundColor = '#dc7c20';
		}
	}
});

let proxyStatusInterval = null

function testProxyStatus() {
	const statusEl = document.getElementById('proxyStatus');
	statusEl.textContent = 'Connecting...';
	statusEl.style.color = 'white';
	statusEl.style.backgroundColor = 'transparent';

	browser.runtime.sendMessage({
		action: 'testCurrentProxy'
	});
}

function handleSwitchRegionChange(enabled) {
	if (enabled) {
		setProxyStatusSection(true);
		testProxyStatus();
		if (!proxyStatusInterval) {
			proxyStatusInterval = setInterval(testProxyStatus, 15000);
		}
	} else {
		setProxyStatusSection(false);
		if (proxyStatusInterval) {
			clearInterval(proxyStatusInterval);
			proxyStatusInterval = null;
		}
	}
}

function setProxyStatusSection(show) {
	const section = document.getElementById('proxyStatus');
	section.style.display = show ? 'block' : 'none';
	if (!show) {
		document.getElementById('proxyStatus').textContent = '';
	}
}

window.addEventListener('unload', () => {
	if (proxyStatusInterval) {
		clearInterval(proxyStatusInterval)
	}
})
