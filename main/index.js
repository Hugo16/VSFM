/*
 * @Author: Hugo16
 * @Date: 2019-12-24 13:00:04
 * @LastEditTime : 2020-01-15 02:51:30
 */
const server = require("../server/main")
const { app, BrowserWindow, ipcMain } = require('electron')

/* 运行本地服务器 */
server();


/* 新建窗口 */
let win;

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  })

  // 加载index.html文件
  win.loadFile('./web/dist/index.html')
  // win.loadURL('http://localhost:3000')

  // 打开开发者工具
  // win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

// 监听来自网页的消息
ipcMain.on("closeWin", (event, arg) => {
  win.close();
})
ipcMain.on("minusWin", (event, arg) => {
  win.minimize();
})