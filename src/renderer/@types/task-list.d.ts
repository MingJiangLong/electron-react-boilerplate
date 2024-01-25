import { TaskStatus, TaskType } from '../constant/task-list-constant';

export type TaskItem = {
  id: string;
  /** 任务id 可能会不唯一 */
  taskId: string;
  /** 任务名称 */
  taskName: string;
  /** 任务状态 */
  taskStatus: TaskStatus;
  /** 任务优先级 */
  taskLevel: number;
  /** 任务类型 */
  taskType: TaskType;

  /** @deprecated 预计开始时间 */
  predictStartTime: string;
  /** @deprecated 预计花费工时 */
  predictSpent: number;
  /** @deprecated 预计完成时间 */
  predictEndTime?: string;
  /** 预计时间范围 */
  predictTime: [string, string];

  /** 实际开始时间 */
  startTime?: string;
  /** 实际花费工时 */
  spent: number;
  /** 实际完成时间 */
  endTime?: string;

  /** 产品经理 */
  productManager: string;
  /** 前端开发 */
  feDeveloper: string;
  /** 后端开发 */
  beDeveloper: string;

  uiDeveloper: string;

  /** 接口文档 */
  beDocUrl: string;
  /** 需求文档 */
  featureDocUrl: string;
  
  uiUrl: string;
};
