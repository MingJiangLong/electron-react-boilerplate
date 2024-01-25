import { Menu, Layout } from 'antd';
import useBoolean from '../hooks/useBoolean';
import {
  MailOutlined,
  SettingOutlined,
  AuditOutlined,
  ScheduleOutlined,
  ToolOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
const { Content, Footer, Sider } = Layout;
import '../App.css';
export default function (props: any) {
  const navigate = useNavigate();
  const menus = [
    {
      key: 'LinkOutlined',
      label: '常用网站',
      icon: <LinkOutlined />,
      onClick() {
        navigate('/usual-website');
      },
    },
    {
      key: 'ScheduleOutlined',
      label: '任务规划',
      icon: <ScheduleOutlined />,
      onClick() {
        navigate('/task-plan');
      },
    },
    {
      key: 'config',
      label: '应用配置',
      icon: <SettingOutlined />,
      onClick() {
        navigate('/config');
      },
    },
  ];
  const [drawerStatus, drawerStatusOperate] = useBoolean();
  return (
    <Layout style={{ width: '100vw', height: '100vh' }} rootClassName="home">
      <Sider
        theme="light"
        collapsible
        collapsed={drawerStatus}
        onCollapse={(value) => drawerStatusOperate.update(value)}
      >
        <Menu items={menus} />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 10,
            overflowY: 'scroll',
          }}
        >
          <Outlet />
        </Content>
        <Footer>主打一个无证经营</Footer>
      </Layout>
    </Layout>
  );
}
