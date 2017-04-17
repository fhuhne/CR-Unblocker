function makeId() {
	let id = '';

	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 32; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return id;
}

const request = require('request');
request(`https://api.crunchyroll.com/start_session.0.json?device_id=${makeId()}&device_type=com.crunchyroll.iphone&access_token=QWjz212GspMHH9h&version=2313.8&locale=enUS`, (err, res, body) => {
	if (err) return process.stderr.write(err);
	body = JSON.parse(body);
	process.stdout.write(body.data.session_id);
});
