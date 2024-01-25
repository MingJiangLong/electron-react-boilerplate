/** 任务类型 */
export enum TaskType {
  /** 热补丁 */
  hotfix = 1,

  /** 需求 */
  feature = 2,

  /** bug */
  bug = 3,

  /** 文档 */
  doc = 4,

  /** 优化 */
  perfect = 5,

  tool = 6,
}
/** 任务状态 */
export enum TaskStatus {
  /** 待开始 */
  DEFAULT = 1,

  /** 进行中 */
  PROCESSING = 2,

  /** 已结束  */
  DONE = 3,

  /** 暂时挂起 */
  HUNG_ON = 4,
}

/** TODO:后面这里要转移到userData里面 */
export const TaskTypeInfo = [
  {
    label: 'hotfix',
    value: TaskType.hotfix,
    color: 'magenta',
  },
  {
    label: 'feature',
    value: TaskType.feature,
    color: 'volcano',
  },
  {
    label: 'bug',
    value: TaskType.bug,
    color: 'red',
  },
  {
    label: 'doc',
    value: TaskType.doc,
    color: 'lime',
  },
  {
    label: 'perfect',
    value: TaskType.perfect,
    color: 'cyan',
  },
  {
    label: 'tool',
    value: TaskType.tool,
    color: 'green',
  },
];

/** 任务规划维度 */
export enum UNIT {
  /** 天为维度 */
  D = 'd',

  /** 周为维度 */
  W = 'w',

  /** 月为维度 */
  M = 'm',
}

