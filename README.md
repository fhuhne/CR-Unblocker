# CR-Unblocker

## What is the CR-Unblocker?
The CR-Unblocker will get an American Session ID and sets it as your current Session ID cookie. Like this Crunchyroll will think you are located in America and therefore you should have access to all anime you couldn't watch.

## I've heared it isn't safe?
The method all Crunchyroll Unblockers are using is basically the same as described above. Your session id is bound to your account after being set as a cookie. However, I take security very serious. The server the backend server is running on is secure. If you notice anything suspicious *PLEASE* tell me.

Please note: I'm not responsible for any compromised accounts.

## Installing
You can just install the Chrome Extension from [here](https://chrome.google.com/webstore/detail/cr-unblocker/agapeeilkibacbfeijlidlgppmjaaijn).

You can also package a zip version of the extension by running

```
npm run build
```

## Setting is up yourself
If you are really concerned about security you can run it yourself. I will give you a brief tutorial here but can't help you with every little detail:

1. You should have some knowledge of NodeJS
2. Clone the backend repo
3. Assuming you got NPM and Nodejs setup, move package.json, getSessionId.js and server.js to your VPS or something like that hosted in America. I can recommend running the server behind a reverse proxy like Nginx.
4.  run 'npm install', 'node server.js' and setup Nginx
5. In extension/background_script.js set the URL of the fetch to the url of the server
6. Add the extension folder as an unpacked extension to chrome.

## Backend Repo
The repo for the backend is [here](https://github.com/onestay/cr-unblocker-server)

## Contributing
The extension is currently still under development. I plan on adding some more features. If you have any idea on what to add feel free to contribute to the project.

## Support me
If you like my work and would like to help me cover the server cost consider becoming a Patreon: https://www.patreon.com/onestay

This would really help me out!
