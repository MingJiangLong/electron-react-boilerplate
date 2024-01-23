import {
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
} from 'antd';
import { TaskItem } from '../../pages/to-do-thing/TodoThing';

type TodoTaskOperateProps = {
  form: FormInstance<any>;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task?: TaskItem;
};
export default function (props: TodoTaskOperateProps) {
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
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
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
        <Form.Item label="产品经理" name="productManager">
          <Input placeholder="输入产品经理" />
        </Form.Item>
        <Form.Item name="feDeveloper" label="前端开发人">
          <Input placeholder="输入前端开发人" />
        </Form.Item>
        <Form.Item name="beDeveloper" label="后端开发人">
          <Input placeholder="输入后端开发" />
        </Form.Item>
        <Form.Item
          name="predictStartTime"
          label="预计开始时间"
          rules={[{ required: true, message: '选择开始时间' }]}
        >
          <DatePicker
            format="YYYY年MM月DD日 HH点"
            placeholder="输入开始时间"
            showHour
          />
        </Form.Item>
        <Form.Item
          name="spent"
          label="预计花费时间"
          rules={[{ required: true, message: '输入预计花费时间' }]}
        >
          <InputNumber precision={1} min={0} addonAfter="小时" />
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
