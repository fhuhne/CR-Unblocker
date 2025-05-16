var browser = browser || chrome

let proxyStatusInterval = null

function setProxyStatusSection(show) {
	const section = document.getElementById('proxy-status-section');
	section.style.display = show ? 'block' : 'none';
	if (!show) {
		document.getElementById('proxyStatus').textContent = '';
	}
}
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
	handleSwitchRegionChange(settings.switchRegion)
});

browser.runtime.onMessage.addListener((message) => {
	if (message.event === 'settingsChanged') {
		handleSwitchRegionChange(message.settings.switchRegion)
	}
})

browser.runtime.onMessage.addListener((message) => {
	if (message.event === 'proxyTestResult') {
		const output = document.getElementById('proxyStatus');

		if (message.success) {
			output.textContent = `✅ Proxy[${message.proxy}] is working!`;
		} else {
			output.textContent = `❌ Proxy[${message.proxy}] failed: ${message.error || 'Unavailable'}`;
		}
	}
});
window.addEventListener('unload', () => {
	if (proxyStatusInterval) {
		clearInterval(proxyStatusInterval)
	}
})

if (/android|iphone|ipad|mobile/i.test(navigator.userAgent)) {
	document.body.classList.add('mobile-popup');
}
