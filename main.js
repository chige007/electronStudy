const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const Store = require('electron-store');
const store = new Store();

class AppWindow extends BrowserWindow {
  constructor (config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences : {
        nodeIntegration : true
      }
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show();
    })
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, 'index.html')

  ipcMain.on('message', (event, arg) => {
    console.log(arg);
    event.sender.send('reply', 'hello from main');
  })
  
  ipcMain.on('getImages', (event, arg) => {
    if (store.get('fileList')) {
      event.sender.send('getImages', store.get('fileList'));
    }
  })

  ipcMain.on('openSecondWin', () => {
    const secondWindow = new AppWindow({
      width: 600,
      height: 400,
      parent: mainWindow
    }, 'second.html')
  })

  ipcMain.on('openFile', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'png', 'gif', 'jpeg']
      }]
    }).then(result => {
      let files = result.filePaths;
      if (files) {
        event.sender.send('selectedFile', files);
      }
    })
  });

  ipcMain.on('saveImages', (event, arg) => {
    let fileList = store.get('fileList');
    if (fileList && fileList.length) {
      fileList = [fileList, ...arg];
      store.set('fileList', fileList);
    } else {
      store.set('fileList', arg);
    }
  });
})