/* global chrome, window, document */

var browser = browser || chrome;

// this extension was heavily inspired by https://github.com/jerryteps/Crunchyroll-Unblocker

// regexp for crunchyroll.com and the US flag
const crunchyryollRegExp = new RegExp('crunchyroll.');
const usRegExp = new RegExp('United States of America');
let hostname = window.location.hostname;

// this will be getting loaded whenever the user visits a site
// if the site is crunchyroll.com it will start the background_script.js with the tld as a message for cookie storing
if (crunchyryollRegExp.test(hostname)) {
	if (!isUs()) {
		chrome.runtime.sendMessage({ msg: hostname.slice(hostname.indexOf('crunchyroll.') + 11, hostname.length) });
	}
}

function isUs() {
	// this will check if the user is in the us by the alt of the image of the country flag
	const location = document.getElementById('footer_country_flag');
	if (usRegExp.test(location.alt)) return true;
}
