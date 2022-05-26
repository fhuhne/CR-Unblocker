# CR-Unblocker 3.0

CR-Unblocker helps accessing region locked anime on Crunchyroll without the need for a VPN. This extension will only proxy the request to obtain the session token but not other traffic. This way the site stays fast and responsive!

## I've heard it isn't safe?
The method CR-Unblocker is using is basically the one described above. Your session id is bound to your account after being set. However, we take security very seriously. If you notice anything suspicious __PLEASE__ tell us.

Please note: We are not responsible for any compromised accounts.

## The extension keep disconnecting me every time, what can I do?
Click on the extension's icon and check "Save login credentials". The next time you log in, your username and password will be stored locally in encrypted form and then used to log you in when switching regions. If the checkbox is not checked, no data will be stored.

## Installing
You can just install the Firefox Extension (also working on Android) from [here](https://addons.mozilla.org/firefox/addon/crunchy-unblocker).

Unfortunately the Chrome and Edge Stores have removed the unblocker from their stores, reuploading would probably not work so this option will no longer be there.

Alternatively you can just download the source and package it yourself. The extension is tested in Firefox, but it should also work in all other browsers supporting WebExtensions API.

## Building

To pack the extension for the extension store you need to follow these steps (on linux, windows may be different):

```bash
npm run-script build
```

## Setting the backend up yourself
If you are really concerned about security you can run it yourself. Up to date instructions can be found in the backend repo.

## Backend repo
The repo for the server backend is [here](https://github.com/onestay/cr-unblocker-server).

## Contributing
The extension is always under development. Some features might be added later. If you have any idea on what to add feel free to contribute to the project or open an issue.
