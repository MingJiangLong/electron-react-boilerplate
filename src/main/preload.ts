// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent, app } from 'electron';
// import { writeFileSync } from 'fs';
// import path from 'path';
export type Channels = 'ipc-example';

// const RESOURCES_PATH = app.isPackaged
//   ? path.join(process.resourcesPath, 'assets/cache')
//   : path.join(__dirname, '../../assets/cache');

// const getCachePath = (...paths: string[]): string => {
//   return path.join(RESOURCES_PATH, ...paths);
// };

export type FileOperateChannel = 'w' | 'r';
export const CACHE_WRITE = 'CACHE_WRITE';
export const CACHE_WRITE_RESULT = 'CACHE_WRITE_RESULT';
export const CACHE_READ = 'CACHE_READ';
export const CACHE_READ_RESULT = 'CACHE_READ_RESULT';
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  cacheOperate: {
    write(fileName: string, data: string, callback: (error: any) => void) {
      ipcRenderer.send(CACHE_WRITE, fileName, data);

      const subscription = (_event: IpcRendererEvent, error?: any) =>
        callback(error);

      ipcRenderer.once(CACHE_WRITE, subscription);
    },
    read(fileName: string, callback: (error: any, data: any) => void) {
      ipcRenderer.send(CACHE_READ, fileName);

      const subscription = (
        _event: IpcRendererEvent,
        error: any,
        data: any,
      ) => {
        if (!error) return callback(null, data);
        return callback(error, null);
      };

      ipcRenderer.once(CACHE_READ, subscription);
    },
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
