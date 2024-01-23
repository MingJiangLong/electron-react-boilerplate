import { Form } from 'antd';
import configJson from '../../../assets/lib/config-list.json';
export default function () {
  console.log(configJson);
  return (
    <>
      <Form>
        <Form.Item label="主题设置2"></Form.Item>
        <Form.Item label="项目列表">
          <Form.List name="hello">
            {(formField, operate) => {
              return <div></div>;
            }}
          </Form.List>
        </Form.Item>
      </Form>
    </>
  );
}
