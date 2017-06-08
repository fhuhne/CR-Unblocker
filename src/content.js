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
 * Check if we're currently on the login page
 * @return {Boolean} true if currently on the login page
 */
function isLoginPage() {
	return window.location.pathname.startsWith('/login');
}

/**
 * This function is called everytime the user visit a crunchyroll page
 * It will ask the background script to get a new cookie if it is not located
 * in the US
 */
if (isLoginPage()) {
	browser.storage.local.get({ saveLogin: false }, (item) => {
		if (item.saveLogin) {
			// login data should be saved --> add event handler to form submit that stores username and password in local storage
			document.querySelector('#login_form').addEventListener('submit', () => {
				let username = document.querySelector('#login_form_name').value;
				let password = document.querySelector('#login_form_password').value;
				browser.storage.local.set({
					loginData: {
						username: username,
						password: password
					}
				});
			});
		}
	});
} else if (!isUs()) {
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
