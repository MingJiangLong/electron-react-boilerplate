import { createHashRouter } from 'react-router-dom';
import ConfigPage from '../pages/ConfigPage';
import Layout from '../layout/Layout';
import TodoThing from '../pages/to-do-thing/TodoThing';

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
        path: '/to-do-thing',
        Component: TodoThing,
      },
    ],
  },
]);
