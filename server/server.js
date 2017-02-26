const express = require('express');

// middleware
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	delayMs: 0
});

const app = express();
// the rate limiter needs this if it's behind a reverse proxy
app.enable('trust proxy');

// use the middleware
app.use(helmet());
app.use(limiter);

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
		res.send(resObject);
	});
});

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
