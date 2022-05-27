browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ["*://*.crunchyroll.com/auth/v1/token"] });

function handleProxyRequest(requestInfo) {
  let settings = this.settings.get()

  if (!settings.switchRegion){
    console.log("Region switching disabled")
    return
  }

  if (!settings.socks_custom){
    settings.socks_host = "cr-unblocker.us.to"
    settings.socks_port = 1080
    settings.socks_user = "crunblocker"
    settings.socks_pass = "crunblocker"
  }

	console.log("Proxied request %s to %s %d", requestInfo.url, settings.socks_host, settings.socks_port);
	return { type: "socks", host: settings.socks_host, port: settings.socks_port, username: settings.socks_user, password: settings.socks_pass }
}
