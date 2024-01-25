import { TaskItem } from "../@types/task-list";

const CACHE_FILE = 'task-list.json';

export default class TaskListCache {
  static read(): Promise<TaskItem[]> {
    return new Promise((resolve, reject) => {
      window?.electron?.cacheOperate.read(CACHE_FILE, (error, data) => {
        if (!error) {
          const list = JSON.parse(data);
          return resolve(list);
        }
        reject(error);
      });
    });
  }

  static write(taskList: TaskItem[]): Promise<boolean> {
    return new Promise((s, e) => {
      window.electron.cacheOperate.write(
        CACHE_FILE,
        JSON.stringify(taskList),
        (error) => {
          if (error) {
            e(error);
          }
          s(true);
        },
      );
    });
  }
}
