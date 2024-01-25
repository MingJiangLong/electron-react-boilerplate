import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Form,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
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
  CheckCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import tip from '../../utils/tip';
import TodoTaskOperate from '../../components/todo-task-operate/TodoTaskOperate';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import useBoolean from '../../hooks/useBoolean';
import dayjs, { Dayjs } from 'dayjs';
import TaskListCache from '../../utils/TaskListCache';
import { TaskItem } from '../../@types/task-list';
import {
  TaskStatus,
  TaskTypeInfo,
  UNIT,
} from '../../constant/task-list-constant';
import Level from '../../components/Level';

export default function () {
  /** 任务安排维度 */
  const [unit, setUnit] = useState(UNIT.W);
  /** 任务列表 */
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

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
      text: '已完成',
      status: 'success',
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
        key: `${item.id}-6`,
        label: <Badge status="default" text="预计开始时间" />,
        children: dayjs(item.predictTime[0]).format('YYYY年 MM月 DD日 HH点'),
      },
      // {
      //   key: `${item.id}-7`,
      //   label: '预计花费',
      //   children: <span>{item.predictSpent}小时</span>,
      // },
      {
        key: `${item.id}-8`,
        label: <Badge status="error" text="预计完成时间" />,
        children: dayjs(item.predictTime[1]).format('YYYY年 MM月 DD日 HH点'),
        span: 2,
      },
      {
        key: `${item.id}-3`,
        label: '产品经理',
        children: item.productManager,
      },
      {
        key: `${item.id}-4`,
        label: '前端开发',
        children: item.feDeveloper,
      },
      {
        key: `${item.id}-5`,
        label: '后端开发',
        children: item.beDeveloper,
      },
      {
        key: `${item.id}-9`,
        label: '需求文档',
        children: <Button type="link">{item.featureDocUrl}</Button>,
        span: 3,
      },
      {
        key: `${item.id}-10`,
        label: '接口文档',
        children: <Button type="link">{item.featureDocUrl}</Button>,
        span: 3,
      },
    ];
  }

  /** 添加任务 */
  async function onAddTask() {
    try {
      const taskDetail = await taskDetailForm.validateFields();

      // 找到维度内可用时间段
      // 1.找到所有未完成的任务 判断是否是时间有冲突
      // 2.任务时间安排
      // TODO:碎片化时间管理好像挺麻烦  自动计划会高的
      const taskTimeScope = taskDetail.predictTime as [string, string];

      // 判断是否
      const newTask = {
        id: uuidv4(),
        taskStatus: TaskStatus.DEFAULT,
        ...taskDetail,
      };

      let tempTaskList: TaskItem[] = [...taskList, newTask];
      await TaskListCache.write(tempTaskList);
      setTaskList(tempTaskList);
      tip.success('已添加任务');
      setShowTaskOperate.off();
    } catch (error: any) {
      if (error?.message) {
        tip.error('添加任务失败');
      }
    }
  }

  async function initTodoTaskList() {
    const taskList = await TaskListCache.read();
    setTaskList(taskList);
  }

  /** 打开添加任务弹窗 */
  function openAddNewTaskModal() {
    taskDetailForm.resetFields();
    setShowTaskOperate.on();
  }

  /** 移除任务 */
  async function onDeleteTodoTask(id: string) {
    try {
      const newTask = taskList.filter((item) => item.id != id);
      await TaskListCache.write(newTask);
      setTaskList(newTask);
      tip.success('已删除任务');
    } catch (error) {
      tip.error('删除任务失败');
    }
  }

  /** 修改任务状态 */
  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const findItem = taskList.find((item) => item.id == id);
      if (!findItem) return;

      // 记录开始任务时间
      if (status == TaskStatus.PROCESSING) {
        findItem.startTime = dayjs().startOf('h').toISOString();
      }

      // 记录任务结束时间
      if (status == TaskStatus.DONE) {
        findItem.endTime = dayjs().endOf('h').toISOString();
      }

      findItem.taskStatus = status;

      await TaskListCache.write([...taskList]);

      // TODO:看看有没有办法通知第三方应用需求状态
      setTaskList([...taskList]);
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

  function getTaskOperateActions(item: TaskItem) {
    let actions = [
      <Tooltip placement="bottom" title="编辑任务" key="EditOutlined">
        <EditOutlined />
      </Tooltip>,
    ];

    if (item.taskStatus == TaskStatus.DEFAULT) {
      actions.push(
        <Popconfirm
          title="开始任务"
          description="你确定要开始该任务?"
          okText="是"
          cancelText="否"
          key="PlayCircleOutlined"
          onConfirm={() => updateTaskStatus(item.id, TaskStatus.PROCESSING)}
        >
          <Tooltip placement="bottom" title="开始任务">
            <PlayCircleOutlined />
          </Tooltip>
        </Popconfirm>,
      );
    }

    if (item.taskStatus == TaskStatus.PROCESSING) {
      actions.push(
        <Popconfirm
          title="结束任务"
          description="你确定要结束该任务?"
          okText="是"
          cancelText="否"
          key="CheckCircleOutlined"
          onConfirm={() => updateTaskStatus(item.id, TaskStatus.DONE)}
        >
          <Tooltip placement="bottom" title="结束任务">
            <CheckCircleOutlined />
          </Tooltip>
        </Popconfirm>,
      );
    }

    actions.push(
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
    );

    return actions;
  }

  const exportButtonStr = useMemo(() => {
    if (unit == UNIT.W) return '导出周报';
    if (unit == UNIT.M) return '导出月报';
    return '导出日报';
  }, [unit]);

  /** 维度内计划内任务 */
  const planListInUnit = useMemo(() => {
    return taskList.filter((item) => {
      return (
        dayjs(item.predictEndTime).isBefore(dayjs().endOf(unit)) &&
        dayjs(item.predictEndTime).isAfter(dayjs().startOf(unit))
      );
    });
  }, [taskList, unit]);

  /**  维度内已完成任务 */
  const doneListInUnit = useMemo(() => {
    return taskList.filter((item) => {
      return (
        item.taskStatus == TaskStatus.DONE &&
        item.endTime &&
        dayjs(item.endTime).isBefore(dayjs().endOf(unit)) &&
        dayjs(item.endTime).isAfter(dayjs().startOf(unit))
      );
    });
  }, [taskList, unit]);

  /** 已逾期任务 */
  const overdueTask = useMemo(() => {
    return taskList.filter((item) => {
      return (
        item.taskStatus != TaskStatus.DONE &&
        dayjs(item.predictTime[1]).isBefore(dayjs().endOf('h'))
      );
    });
  }, [taskList]);

  useEffect(() => {
    initTodoTaskList();
  }, [unit]);

  return (
    <>
      <Select
        options={[
          { label: '日', value: UNIT.D },
          { label: '周', value: UNIT.W },
          { label: '月', value: UNIT.M },
        ]}
        value={unit}
        onChange={(e) => setUnit(e)}
      />
      <SettingOutlined size={50} color='black'/>
      <Button type="primary">{exportButtonStr}</Button>
      <TodoTaskOperate
        onClose={setShowTaskOperate.off}
        visible={showTaskOperate}
        form={taskDetailForm}
        onSubmit={() => onAddTask()}
      />
      <Badge.Ribbon text={`共${taskList.length}个任务`}>
        <Card
          title={<>{unitStr}计划内任务</>}
          style={{ marginTop: 15 }}
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
            items={planListInUnit.map((item) => {
              const tagInfo = TaskTypeInfo.find(
                (info) => info.value == item.taskType,
              );
              const statusInfo = getTaskStatusInfo(item.taskStatus);
              return {
                key: item.id,
                label: (
                  <Row style={{ width: '100%' }}>
                    <Col span={1}>
                      <Level level={item.taskLevel} />
                    </Col>
                    <Col span={2}>
                      <Tag color={tagInfo?.color}>{tagInfo?.label}</Tag>
                    </Col>
                    <Col span={2}>
                      <Badge
                        text={statusInfo.text}
                        status={statusInfo.status}
                      />
                    </Col>

                    <Col span={19}>
                      {item.taskId} / {item.taskName}
                    </Col>
                  </Row>
                ),
                children: (
                  <Card bordered={false} actions={getTaskOperateActions(item)}>
                    <Descriptions
                      bordered
                      items={buildTodoTaskCardItem(item)}
                    />
                  </Card>
                ),
              };
            })}
          />
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={`共${doneListInUnit.length}个任务`} color="green">
        <Card style={{ marginTop: 15 }} title={<>{unitStr}已完成任务</>}></Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={`共${overdueTask.length}个任务`} color="red">
        <Card style={{ marginTop: 15 }} title={<>逾期未完成任务</>}></Card>
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
