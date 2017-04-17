// https://github.com/jerryteps/Crunchyroll-Unblocker/issues/3#issuecomment-278598931

const cloudscraper = require('cloudscraper');

const URL = 'http://www.crunchyroll.com';

cloudscraper.get(URL, (err, res) => {
	if (err) return process.stderr.write(err);
	if (res.statusCode !== 200) return process.stderr.write(`statusCode isn't 200: ${res.statusCode}`);

	let headers = {};
	headers[res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[1]] = res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[2];
	headers[res.headers['set-cookie'][1].match(/(.*?)=(.*?);/)[1]] = res.headers['set-cookie'][1].match(/(.*?)=(.*?);/)[2];

	cloudscraper.request({
		headers: headers,
		url: URL,
		method: 'GET'
	}, (_err, _res) => {
		if (_err) return process.stderr.write(_err);
		if (_res.statusCode !== 200) return process.stderr.write(`statusCode isn't 200: ${_res.statusCode}`);
		let sessionId = _res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[2];

		process.stdout.write(sessionId);
	});
});
