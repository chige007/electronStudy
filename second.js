// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    var fileList = [];

    document.getElementById('uploadBtn').addEventListener('click', () => {
        ipcRenderer.send('openFile');
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        console.log('saveImages');
        console.log(fileList);
        ipcRenderer.send('saveImages', fileList);
    });

    var renderImages = (files) => {
        let images = '';
        for (let i = 0; i < files.length; i++) {
            images += '<img src="file://'+ files[i] +'"/>';
        }
        return images;
    }
    ipcRenderer.on('selectedFile', (event, files) => {
        let images = renderImages(files);
        document.getElementById('imageList').innerHTML = images;
        fileList = files;
    });

    ipcRenderer.send('getImages');
    ipcRenderer.on('getImages', (event, files) => {
        let images = renderImages(files);
        document.getElementById('imageList').innerHTML = images;
    })
})
