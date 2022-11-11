const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    fullscreen:true,
    autoHideMenuBar:true,
    minimizable:true,
    closable:false,
    movable:false,
    resizable:false,
    webPreferences: {
      nodeIntegration: true,     // ATENÇÃO AQUI - attention here - that's why your node_module works or not
    },
  });

  win.loadFile('index.html');

  // win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});