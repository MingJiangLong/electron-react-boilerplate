import {
  Badge,
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Popconfirm,
  Tooltip,
} from 'antd';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import { useEffect, useMemo, useState } from 'react';
import {
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import tip from '../../utils/tip';
import TodoTaskOperate from '../../components/todo-task-operate/TodoTaskOperate';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import useBoolean from '../../hooks/useBoolean';
import dayjs from 'dayjs';
export enum TaskStatus {
  /** 待开始 */
  DEFAULT = 1,

  /** 进行中 */
  PROCESSING = 2,

  /** 已结束  */
  DONE = 3,
}
export type TaskItem = {
  id: string;
  taskId: string;
  taskName: string;
  predictStartTime: string;
  deadlineTime?: string;
  taskStatus: TaskStatus;
  productManager: string;
  feDeveloper: string;
  beDeveloper: string;
  beDocUrl: string;
  featureDocUrl: string;
  spent: number;
};
enum UNIT {
  /** 天为维度 */
  D = 1,

  /** 周为维度 */
  W = 2,

  /** 月为维度 */
  M = 3,
}
export default function () {
  /** 任务安排维度 */
  const [unit, setUnit] = useState(UNIT.M);
  const [todoThingsList, setTodoThingsList] = useState<TaskItem[]>([]);
  const [taskDetailForm] = Form.useForm();
  const [showTaskOperate, setShowTaskOperate] = useBoolean();

  function getTaskStatusInfo(value: TaskStatus): {
    text: string;
    status: PresetStatusColorType;
  } {
    if (value == TaskStatus.DEFAULT)
      return {
        text: '待开始',
        status: 'default',
      };

    if (value == TaskStatus.PROCESSING)
      return {
        text: '进行中',
        status: 'processing',
      };
    return {
      text: '错误状态',
      status: 'error',
    };
  }
  function buildTodoTaskCardItem(item: TaskItem) {
    return [
      {
        key: `${item.id}-1`,
        label: '任务名称',
        children: item.taskName,
      },
      {
        key: `${item.id}-1-2`,
        label: '任务ID',
        children: item.taskId,
      },
      {
        key: `${item.id}-2`,
        label: '任务状态',
        children: <Badge {...getTaskStatusInfo(item.taskStatus)} />,
      },
      {
        key: `${item.id}-3`,
        label: '产品经理',
        children: item.productManager,
      },
      {
        key: `${item.id}-4`,
        label: '前端开发人员',
        children: item.feDeveloper,
      },
      {
        key: `${item.id}-5`,
        label: '后端开发人员',
        children: item.beDeveloper,
      },
      {
        key: `${item.id}-6`,
        label: <Badge status="default" text="预计开始时间" />,
        children: dayjs(item.predictStartTime).format('YYYY年 MM月 DD日 HH点'),
      },
      {
        key: `${item.id}-7`,
        label: '预计工时',
        children: <span>{item.spent}小时</span>,
      },
      {
        key: `${item.id}-8`,
        label: <Badge status="error" text="截至时间" />,
        children: dayjs(item.deadlineTime).format('YYYY年 MM月 DD日 HH点'),
      },
      {
        key: `${item.id}-9`,
        label: '需求文档地址',
        children: <Button type="link">{item.featureDocUrl}</Button>,
        span: 3,
      },
      {
        key: `${item.id}-10`,
        label: '后端接口文档地址',
        children: <Button type="link">{item.featureDocUrl}</Button>,
        span: 3,
      },
    ];
  }

  /** 同步缓存 */
  function saveIntoCache(newTaskItems: TaskItem[]) {
    return new Promise((s, e) => {
      window.electron.cacheOperate.write(
        'a-weak-task-list.json',
        JSON.stringify(newTaskItems),
        (error) => {
          if (error) {
            e(error);
          }
          s(true);
        },
      );
    });
  }

  /** 添加任务 */
  async function onAddTodoTask() {
    try {
      const taskDetail = await taskDetailForm.validateFields();
      console.log(
        dayjs(taskDetail.predictStartTime).add(taskDetail.spent, 'h'),
      );

      let newTask = [
        ...todoThingsList,
        {
          id: uuidv4(),
          taskStatus: TaskStatus.DEFAULT,
          deadlineTime: dayjs(taskDetail.predictStartTime).add(
            taskDetail.spent,
            'h',
          ),
          ...taskDetail,
        },
      ];
      await saveIntoCache(newTask);
      setTodoThingsList(newTask);
      tip.success('已添加任务');
      setShowTaskOperate.off();
    } catch (error: any) {
      if (error?.message) {
        tip.error('添加任务失败');
      }
    }
  }

  function initTodoTaskList() {
    window.electron.cacheOperate.read(
      'a-weak-task-list.json',
      (error, data) => {
        if (!error) {
          const list = JSON.parse(data);
          return setTodoThingsList(list);
        }
        setTodoThingsList([]);
      },
    );
  }

  /** 打开添加任务弹窗 */
  function openAddNewTaskModal() {
    taskDetailForm.resetFields();
    setShowTaskOperate.on();
  }

  /** 移除任务 */
  async function onDeleteTodoTask(id: string) {
    try {
      const newTask = todoThingsList.filter((item) => item.id != id);
      await saveIntoCache(newTask);
      setTodoThingsList(newTask);
      tip.success('已删除任务');
    } catch (error) {
      tip.error('删除任务失败');
    }
  }

  /** 修改任务状态 */
  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const findItem = todoThingsList.find((item) => item.id == id);
      if (!findItem) return;
      findItem.taskStatus = status;
      saveIntoCache([...todoThingsList]);
      setTodoThingsList([...todoThingsList]);
      if (status == TaskStatus.PROCESSING) tip.success('开始进行任务');
      if (status == TaskStatus.DONE) tip.success('已结束任务');
    } catch (error) {
      tip.error('修改任务状态失败');
    }
  }

  const unitStr = useMemo(() => {
    if (unit == UNIT.D) return '今日';
    if (unit == UNIT.W) return '本周';
    if (unit == UNIT.M) return '本月';
  }, [unit]);

  const WORK_TIME = {
    am: [9, 12],
    pm: [13.5, 18],
  };
  
  useEffect(() => {
    initTodoTaskList();
  }, [unit]);
  return (
    <>
      <TodoTaskOperate
        onClose={setShowTaskOperate.off}
        visible={showTaskOperate}
        form={taskDetailForm}
        onSubmit={() => onAddTodoTask()}
      />
      <Badge.Ribbon
        text={`共${todoThingsList.length}个计划内任务`}
        color="green"
      >
        <Card
          title={<>{unitStr}计划内任务</>}
          actions={[
            <Button
              key="PlusOutlined"
              icon={<PlusOutlined />}
              onClick={() => openAddNewTaskModal()}
            >
              添加新任务
            </Button>,
          ]}
        >
          <Collapse
            expandIcon={({ isActive }) =>
              isActive ? <ColumnHeightOutlined /> : <ColumnWidthOutlined />
            }
            items={todoThingsList.map((item) => ({
              key: item.taskId,
              label: (
                <Badge
                  text={item.taskName}
                  status={getTaskStatusInfo(item.taskStatus).status}
                />
              ),
              children: (
                <Card
                  bordered={false}
                  actions={[
                    <Tooltip
                      placement="bottom"
                      title="编辑任务"
                      key="EditOutlined"
                    >
                      <EditOutlined />
                    </Tooltip>,
                    item.taskStatus == TaskStatus.DEFAULT && (
                      <Popconfirm
                        title="开始任务"
                        description="你确定要开始该任务?"
                        okText="是"
                        cancelText="否"
                        key="PlayCircleOutlined"
                        onConfirm={() =>
                          updateTaskStatus(item.id, TaskStatus.PROCESSING)
                        }
                      >
                        <Tooltip placement="bottom" title="开始任务">
                          <PlayCircleOutlined />
                        </Tooltip>
                      </Popconfirm>
                    ),
                    <Popconfirm
                      title="删除任务"
                      description="你确定要删除该任务?"
                      okText="是"
                      cancelText="否"
                      key="DeleteOutlined"
                      onConfirm={() => onDeleteTodoTask(item.id)}
                    >
                      <Tooltip placement="bottom" title="删除任务">
                        <DeleteOutlined />
                      </Tooltip>
                    </Popconfirm>,
                  ]}
                >
                  <Descriptions bordered items={buildTodoTaskCardItem(item)} />
                </Card>
              ),
            }))}
          />
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={`共${todoThingsList.length}个任务`} color="yellow">
        <Card style={{ marginTop: 15 }} title={<>{unitStr}截止任务</>}></Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={`共${todoThingsList.length}个任务`} color="red">
        <Card style={{ marginTop: 15 }} title={<>已过截止时间任务</>}></Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={`都有什么时间可以摸鱼呢?`} color="blue">
        <Card
          style={{ marginTop: 15 }}
          title={<>{unitStr}剩余可安排时间段</>}
        ></Card>
      </Badge.Ribbon>
    </>
  );
}
