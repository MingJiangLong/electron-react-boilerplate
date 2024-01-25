import { createHashRouter } from 'react-router-dom';
import ConfigPage from '../pages/ConfigPage';
import Layout from '../layout/Layout';
import TaskPlan from '../pages/task-plan/TaskPlan';
import RemotePage from '../pages/RemotePage';
import UsualWebsite from '../pages/UsualWebsite';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/config',
        Component: ConfigPage,
      },
      {
        path: '/task-plan',
        Component: TaskPlan,
      },
      {
        path: '/usual-website',
        Component: UsualWebsite,
        children: [
          {
            path: 'detail',
            Component: RemotePage,
          },
        ],
      },
    ],
  },
]);
