/* global chrome, window, document */
var browser = browser || chrome;

// this extension was heavily inspired by https://github.com/jerryteps/Crunchyroll-Unblocker

/**
 * Check if the current CR page is located in the US
 * @return {Boolean} true if currently in the US
 */
function isUs() {
	let usRegExp = new RegExp('United States of America');
	let location = document.getElementById('footer_country_flag');
	return !!usRegExp.test(location.alt);
}

/**
 * This function is called everytime the user visit a crunchyroll page
 * It will ask the background script to get a new cookie if it is not located
 * in the US
 */
if (!isUs()) {
	let hostname = window.location.hostname;
	browser.runtime.sendMessage({	msg: hostname.slice(hostname.indexOf('crunchyroll.') + 11, hostname.length) });
} else {
	console.log('You are already registered in the US.');
}

/**
 * Reload the page when asked by the background script
 */
browser.runtime.onMessage.addListener((message) => {
	console.log('reloading');
	if (message.msg === 'reload') {
		location.reload(true);
	}
});
