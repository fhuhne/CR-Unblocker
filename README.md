# CR-Unblocker 3.0

CR-Unblocker helps accessing region locked anime on Crunchyroll without the need for a VPN. This extension will only proxy the request to obtain the session token but not other traffic. This way the site stays fast and responsive!

## I've heard it isn't safe?
We only proxy the token request through a proxy - no logging or similar! If you do not trust our servers, you are free to configure your own SOCKS proxy in the extension settings. Please note that we can not be held responsible for compromised accounts.

## Installing
You can just install the Firefox Extension (also working on Android) from [here](https://addons.mozilla.org/firefox/addon/crunchy-unblocker).

Unfortunately the Chrome and Edge Stores have removed the unblocker from their stores, reuploading would probably not work so this option will no longer be there.

Alternatively you can just download the source and package it yourself. The extension is tested in Firefox, but it should also work in all other browsers supporting WebExtensions API.

## How to Install CR-Unblocker on Android (Two Methods)

### **Option 1: Easiest Way (Desktop View in Firefox Mobile)**

1. Open Firefox on your Android device.
2. Go to the [CR-Unblocker Add-on page](https://addons.mozilla.org/en-US/firefox/addon/crunchy-unblocker/).
3. Switch your browser to **Desktop view** (tap the three dots menu and select "Desktop site").
4. You should now see the **"Add to Firefox"** button—tap it to install the add-on.

> *Tested and working on Firefox version 138 (Android).*

---

### **Option 2: Using Firefox Nightly with Custom Add-on Collections**

**Requirements:**

* Android version 5.0 or higher
* Mozilla Firefox account

#### Steps:

1. **Create a Firefox Account:**
   Go to the [Mozilla Firefox site](https://support.mozilla.org/en-US/kb/access-mozilla-services-firefox-account) and create an account.
   You'll need this account to [create a custom collection](https://support.mozilla.org/en-US/kb/how-use-collections-addonsmozillaorg).

2. **Create a Collection:**
   After logging in, create a collection and add the CR-Unblocker extension to it.
   Your collection's **user ID** and **collection name** can be found [here](https://addons.mozilla.org/en-US/firefox/collections/).

3. **Install Firefox Nightly:**
   Download and install [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en_US) from the Play Store.

4. **Add Your Collection to Firefox Nightly:**
   Follow [this guide](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) to add your collection to the app.

5. **Install the Add-on:**
   Once your collection is added, you'll be able to install CR-Unblocker directly from your collection in Firefox Nightly.

#### **Tips for Using the Add-on**

* **To adjust settings:**
  Tap the three dots (`⋮`) → Add-ons → CR-Unblocker → Make your changes.

* **To open Crunchyroll via CR-Unblocker:**
  Open any website → Tap the three dots (`⋮`) → Add-ons → CR-Unblocker → Open Crunchyroll → Enjoy!

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
