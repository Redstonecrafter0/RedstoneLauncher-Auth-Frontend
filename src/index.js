const { app, BrowserWindow, session } = require('electron')
const path = require('path')

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

  const allowed = [
      'https://login.live.com/',
      'https://github.com/login?',
      'https://github.com/sessions/two-factor',
      'https://github.com/login/oauth/authorize?'
  ]

  const log = [
      'https://login.live.com/oauth20_desktop.srf?lc=',
      'http://localhost:4561/api/auth/github?'
  ]

  window.webContents.on('will-redirect', function (e, url) {
    if (log.filter((s) => url.startsWith(s)).length !== 0) {
      console.log(url)
      window.close()
    } else if (allowed.filter((s) => url.startsWith(s)).length === 0) {
      window.close()
    }
  })

  window.loadURL({
    msa: 'https://login.live.com/oauth20_authorize.srf?client_id=000000004C12AE6F&redirect_uri=https://login.live.com/oauth20_desktop.srf&scope=service::user.auth.xboxlive.com::MBI_SSL&display=touch&response_type=token',
    gh: `https://github.com/login/oauth/authorize?client_id=c142b194f00f7aeee6ba&scope=repo&state=${process.argv[2]}`
  }[process.argv[1]])
}

app.on('ready', () => session.defaultSession.clearStorageData().then(createWindow))

app.on('window-all-closed', () => session.defaultSession.clearStorageData().then(app.quit))
