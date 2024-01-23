/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { writeFile, readFile } from 'fs';
export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function readElectronFile(filePath: string) {
  return new Promise((s, e) => {
    readFile(filePath, (err, data) => {
      if (err) return e(err);
      s(data.toString());
    });
  });
}

export function writeElectronFile(filePath: string, data: string) {
  return new Promise((s, e) => {
    writeFile(filePath, data, (err) => {
      if (err) return e(err);
      s(true);
    });
  });
}
