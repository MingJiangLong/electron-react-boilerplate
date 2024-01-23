import { notification } from 'antd';
import { ArgsProps } from 'antd/es/message';

export default {
  success(message?: string, title?: string) {
    notification.success({
      message: title ?? '操作成功',
      description: message ?? '操作成功',
    });
  },
  error(message?: string, title?: string) {
    notification.error({
      message: title ?? '操作失败',
      description: message ?? '操作失败',
    });
  },
};
