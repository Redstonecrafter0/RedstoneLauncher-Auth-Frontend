const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const shell = require("shell")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: '#000000'
    },
    icon: path.join(__dirname, 'icon.png')
  })

  window.setMenu(null)

  window.webContents.on('will-redirect', function (e, url) {
    if (url.startsWith('https://login.live.com/')) {
      if (url.startsWith('https://login.live.com/oauth20_desktop.srf?lc=')) {
        console.log(url)
        window.close()
      }
    } else {
      shell.openExternal(url)
      window.close()
    }
  })

  window.loadURL('https://login.live.com/oauth20_authorize.srf?client_id=000000004C12AE6F&redirect_uri=https://login.live.com/oauth20_desktop.srf&scope=service::user.auth.xboxlive.com::MBI_SSL&display=touch&response_type=token')
}

app.on('ready', () => session.defaultSession.clearStorageData().then(() => createWindow()))

app.on('window-all-closed', () => {
  session.defaultSession.clearStorageData().then(() => app.quit())
})
