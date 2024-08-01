const { app, BrowserWindow } = require('electron');
const path = require ('path');
const isMac = process.platform === 'darwin';
const isDev= process.env.NODE_ENV !== 'production';

function createMainWindow () {
    mainWindow = new BrowserWindow ({
        title: ' Esmt food app',
        width: isDev ? 1000 : 500,
        height: 1000,
        frame: false, 
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration:true,
            preload: path.join(__dirname,'preload.js')
        }
    });



       //Open dev tools if in dev environment
    if (isDev){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}


//App is ready

app.whenReady().then( ()=>{
    createMainWindow();


//Remove mainWindow from memory on close
    mainWindow.on('closed',()=> (mainWindow = null));

    app.on('activate',()=>{
        if (BrowserWindow.getAllWindows().length===0){
            createMainWindow();
        }
    });
});

app.on('window-all-closed', ()=>{
    if (!isMac){
        app.quit();
    }
} );