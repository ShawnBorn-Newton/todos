const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

//main window
app.on('ready', () => {
  mainWindow = new BrowserWindow({titleBarStyle: 'hiddenInset'});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

//build menu:
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {

  addWindow = new BrowserWindow({
   width: 300,
   height: 200,
   frame: false,
   title: 'Add New ToDo'
  });
addWindow.loadURL(`file://${__dirname}/add.html`);
addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New ToDo',
        click(){ createAddWindow(); }
      },
      {
        label: 'Clear ToDos',
        click() {
          mainWindow.webContents.send('todo:clear');
        } 
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' :'Ctrl+Q',
        click() {
         app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
  label: 'DEVELOPER',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}