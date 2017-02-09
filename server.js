const express = require('express');
const app = express();

const exec = require('child_process').exec;

app.get('/getId', (req, res) => {
	exec('node getSessionId.js', (error, stdout) => {
		let resObject;
		if (error) {
			resObject = {
				ok: false,
				error: error
			};
		} else {
			resObject = {
				ok: true,
				sessionId: stdout
			};
		}
		console.log(resObject);
		res.send(resObject);
	});
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
