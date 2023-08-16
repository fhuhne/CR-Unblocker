# CR-Unblocker 3.0

CR-Unblocker helps accessing region locked anime on Crunchyroll without the need for a VPN. This extension will only proxy the request to obtain the session token but not other traffic. This way the site stays fast and responsive!

## I've heard it isn't safe?
We only proxy the token request through a proxy - no logging or similar! If you do not trust our servers, you are free to configure your own SOCKS proxy in the extension settings. Please note that we can not be held responsible for compromised accounts.

## Installing
You can just install the Firefox Extension (also working on Android) from [here](https://addons.mozilla.org/firefox/addon/crunchy-unblocker).

Unfortunately the Chrome and Edge Stores have removed the unblocker from their stores, reuploading would probably not work so this option will no longer be there.

Alternatively you can just download the source and package it yourself. The extension is tested in Firefox, but it should also work in all other browsers supporting WebExtensions API.
## Installing mobile (Andriod only)
**Requirements**: <br> <li> Android version 5.0 or higher </li> <li> Mozilla Firefox account </li> 

Visit the [Mozilla Firefox site](https://support.mozilla.org/en-US/kb/access-mozilla-services-firefox-account) and create a account. The account is required to [create a collection](https://support.mozilla.org/en-US/kb/how-use-collections-addonsmozillaorg). Then you have to add the CR-Unblocker extension to your collection. The created collection will be added to your Firefox Nightly so the exentsion can be used.

You have to download [Firefox Nightly](https://play.google.com/store/apps/datasafety?id=org.mozilla.fenix&hl=en_US). After the installation you have to [add the collection](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) to your app.
You can find the user id and the collection name in [your collection](https://addons.mozilla.org/en-US/firefox/collections/).

**Tips for using the app** <br>
For adjusting the settings: <br> Click on the three dots --> Add-ons --> Cr-Unblocker --> Make your changes
git 

For open Crunchyroll over CR-Unblocker: <br>Open a random website --> Click on the three dots --> Add-ons --> Cr-Unblocker --> Open Crunyroll --> Enjoy

## Requirements

It is not strictly required, but to run the helper commands for testing and packing the extension you should have these installed:

* nodejs 16

## Building

To pack the extension for the extension store you need to follow these steps:

```bash
npm run build
```

## Using a private proxy
If you really don't trust us or the server is offline you can point the extension to any SOCKS proxy. See the extension settings.

## Contributing
The extension is always under development. Some features might be added later. If you have any idea on what to add feel free to contribute to the project or open an issue.
