import {
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { TaskType } from '../../constant/task-list-constant';
import { TaskItem } from '../../@types/task-list';

type TaskOperateProps = {
  form: FormInstance<any>;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task?: TaskItem;
};
const taskTypeOptions = [
  { label: '需求(feature)', value: TaskType.feature },
  { label: '热修(hotfix)', value: TaskType.hotfix },
  { label: 'bug', value: TaskType.bug },
  { label: '文档(doc)', value: TaskType.doc },
  { label: '优化(perfect)', value: TaskType.perfect },
  { label: '工具(tool)', value: TaskType.tool },
];
export default function (props: TaskOperateProps) {
  return (
    <Modal
      title="任务管理"
      open={props.visible}
      okText="确定"
      cancelText="取消"
      width={~~(window.innerWidth * 0.4)}
      onCancel={() => props?.onClose()}
      onOk={() => props.onSubmit()}
    >
      <Form
        form={props.form}
        // labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        style={{ padding: 10 }}
      >
        <Form.Item
          label="任务类型"
          name="taskType"
          initialValue={TaskType.feature}
        >
          <Select options={taskTypeOptions} />
        </Form.Item>
        <Form.Item label="任务优先级" name="taskLevel" initialValue={3}>
          <InputNumber min={1} max={3} precision={0} addonAfter="L" />
        </Form.Item>
        <Form.Item
          name="taskId"
          label="任务Id"
          rules={[{ required: true, message: '输入任务关联Id' }]}
        >
          <Input placeholder="输入任务关联Id" />
        </Form.Item>
        <Form.Item
          name="taskName"
          label="任务名称"
          rules={[{ required: true, message: '输入任务名称' }]}
        >
          <Input placeholder="输入任务名称" />
        </Form.Item>
        <Form.Item
          name="predictTime"
          label="预计时间范围"
          initialValue={dayjs()}
          rules={[{ required: true, message: '选择任务时间' }]}
        >
          <DatePicker.RangePicker
            format="YYYY年MM月DD日 HH点"
            showTime
            placeholder={['选择任务预计开始时间', '选择任务预计结束时间']}
          />
        </Form.Item>
        {/* <Form.Item
          name="predictSpent"
          label="预计花费时间"
          rules={[{ required: true, message: '输入预计花费时间' }]}
        >
          <InputNumber precision={1} min={0} addonAfter="小时" />
        </Form.Item> */}

        <Form.Item label="产品经理" name="productManager">
          <Input placeholder="输入产品经理" />
        </Form.Item>
        <Form.Item name="feDeveloper" label="前端开发人">
          <Input placeholder="输入前端开发人" />
        </Form.Item>
        <Form.Item name="beDeveloper" label="后端开发人">
          <Input placeholder="输入后端开发" />
        </Form.Item>
        <Form.Item name="featureDocUrl" label="需求文档地址">
          <Input placeholder="输入需求文档地址" />
        </Form.Item>
        <Form.Item name="beDocUrl" label="后端接口文档地址">
          <Input placeholder="输入后端接口文档地址" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
