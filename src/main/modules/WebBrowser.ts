// 在主进程中.
import { BrowserWindow } from 'electron';
export function initBrowserWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  // Load a remote URL
  win.loadURL('https://github.com');

  // Or load a local HTML file
  // win.loadFile('index.html');
}
