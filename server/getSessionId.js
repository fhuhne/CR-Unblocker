// https://github.com/jerryteps/Crunchyroll-Unblocker/issues/3#issuecomment-278598931

const cloudscraper = require('cloudscraper');

const URL = 'http://www.crunchyroll.com';

cloudscraper.get(URL, (err, res) => {
	if (err) return console.log(err);

	if (res.statusCode !== 200) return console.log(res.statusCode);

	let headers = {};
	headers[res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[1]] = res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[2];
	headers[res.headers['set-cookie'][1].match(/(.*?)=(.*?);/)[1]] = res.headers['set-cookie'][1].match(/(.*?)=(.*?);/)[2];

	cloudscraper.request({
		headers: headers,
		url: URL,
		method: 'GET'
	}, (_err, _res) => {
		if (_err) return console.log(_err);
		if (_res.statusCode !== 200) return console.log(_res.statusCode);

		console.log(_res.headers['set-cookie'][0].match(/(.*?)=(.*?);/)[2]);
	});
});
