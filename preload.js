const path= require('path');

const {contextBridge, ipcRenderer }= require ('electron');

contextBridge.exposeInMainWorld ('path', {
    join: (...args)=> path.join(...args)
});

contextBridge.exposeInMainWorld ('ipcRenderer', {
    send: (channel, data)=> ipcRenderer.send(channel,data),
    on:(channel, func)=>
        ipcRenderer.on (channel, (event, ...args)=> func (...args))
});
